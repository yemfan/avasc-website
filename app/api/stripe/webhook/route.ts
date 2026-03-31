import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPrisma } from "@/lib/prisma";
import { generateDonationReceiptPdf } from "@/lib/receipts/generate-donation-receipt";
import { sendDonationConfirmationEmail } from "@/lib/email/send-donation-confirmation";
import { sendMonthlyDonationThankYouEmail } from "@/lib/email/send-monthly-donation-thank-you";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2026-03-25.dahlia",
    })
  : null;

const sendMonthlyConfirmation = process.env.SEND_MONTHLY_CONFIRMATION_EMAIL === "true";
const is501c3 = process.env.AVASC_IS_501C3 === "true";
const avascEin = process.env.AVASC_EIN || "";

type DonationKind = "one_time" | "monthly" | "unknown";

function isCheckoutSessionCompleted(
  event: Stripe.Event
): event is Stripe.Event & { data: { object: Stripe.Checkout.Session } } {
  return event.type === "checkout.session.completed";
}

function getDonationKind(session: Stripe.Checkout.Session): DonationKind {
  const metadataType = session.metadata?.donationType;
  if (session.mode === "payment" || metadataType === "one_time") return "one_time";
  if (session.mode === "subscription" || metadataType === "monthly") return "monthly";
  return "unknown";
}

function formatAmount(amountTotal: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountTotal / 100);
}

function getDonorName(session: Stripe.Checkout.Session): string {
  const fromMeta = session.metadata?.donorName?.trim();
  if (fromMeta) return fromMeta;
  return session.customer_details?.name?.trim() || "Supporter";
}

function getDonorEmail(session: Stripe.Checkout.Session): string {
  return session.customer_details?.email?.trim() || "";
}

function getTransactionId(session: Stripe.Checkout.Session): string {
  if (typeof session.payment_intent === "string" && session.payment_intent) return session.payment_intent;
  return session.id;
}

function getSubscriptionId(session: Stripe.Checkout.Session): string {
  if (typeof session.subscription === "string" && session.subscription) return session.subscription;
  return session.id;
}

function getDonationDate(event: Stripe.Event): string {
  return new Date(event.created * 1000).toISOString().slice(0, 10);
}

async function alreadyProcessedOneTime(transactionId: string): Promise<boolean> {
  const prisma = getPrisma();
  const existing = await prisma.donation.findUnique({
    where: { providerTransactionId: transactionId },
    select: { id: true, receiptSentAt: true },
  });
  return Boolean(existing?.receiptSentAt);
}

async function alreadyProcessedMonthly(subscriptionId: string): Promise<boolean> {
  const prisma = getPrisma();
  const existing = await prisma.donation.findUnique({
    where: { providerSubscriptionId: subscriptionId },
    select: { id: true, monthlyConfirmationSentAt: true },
  });
  return Boolean(existing?.monthlyConfirmationSentAt);
}

async function createOrUpdateOneTimeDonation(params: {
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  sessionId: string;
}) {
  const prisma = getPrisma();
  return prisma.donation.upsert({
    where: { providerTransactionId: params.transactionId },
    create: {
      donorName: params.donorName,
      donorEmail: params.donorEmail,
      amount: params.amount,
      currency: params.currency,
      paymentProvider: "stripe",
      donationType: "one_time",
      providerSessionId: params.sessionId,
      providerTransactionId: params.transactionId,
    },
    update: {
      donorName: params.donorName,
      donorEmail: params.donorEmail,
      amount: params.amount,
      currency: params.currency,
      providerSessionId: params.sessionId,
    },
  });
}

async function createOrUpdateMonthlyDonation(params: {
  donorName: string;
  donorEmail: string;
  sessionId: string;
  subscriptionId: string;
}) {
  const prisma = getPrisma();
  return prisma.donation.upsert({
    where: { providerSubscriptionId: params.subscriptionId },
    create: {
      donorName: params.donorName,
      donorEmail: params.donorEmail,
      paymentProvider: "stripe",
      donationType: "monthly",
      providerSessionId: params.sessionId,
      providerSubscriptionId: params.subscriptionId,
    },
    update: {
      donorName: params.donorName,
      donorEmail: params.donorEmail,
      providerSessionId: params.sessionId,
    },
  });
}

async function getNextReceiptNumber(): Promise<string> {
  const prisma = getPrisma();
  const year = new Date().getFullYear();
  const count = await prisma.donation.count({
    where: {
      donationType: "one_time",
      createdAt: {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
      },
    },
  });
  return `AVASC-${year}-${String(count + 1).padStart(4, "0")}`;
}

async function markReceiptSent(donationId: string, receiptNumber: string) {
  const prisma = getPrisma();
  await prisma.donation.update({
    where: { id: donationId },
    data: { receiptNumber, receiptSentAt: new Date() },
  });
}

async function markMonthlyConfirmationSent(donationId: string) {
  const prisma = getPrisma();
  await prisma.donation.update({
    where: { id: donationId },
    data: { monthlyConfirmationSentAt: new Date() },
  });
}

async function handleOneTimeDonation(event: Stripe.Event & { data: { object: Stripe.Checkout.Session } }) {
  const session = event.data.object;
  const donorEmail = getDonorEmail(session);
  if (!donorEmail) throw new Error("Missing donor email for one-time donation.");

  const donorName = getDonorName(session);
  const amountTotal = session.amount_total ?? 0;
  const currency = session.currency ?? "usd";
  const transactionId = getTransactionId(session);
  const donationDate = getDonationDate(event);

  if (await alreadyProcessedOneTime(transactionId)) return;

  const donation = await createOrUpdateOneTimeDonation({
    donorName,
    donorEmail,
    amount: amountTotal,
    currency,
    transactionId,
    sessionId: session.id,
  });

  const receiptNumber = await getNextReceiptNumber();
  const formattedAmount = formatAmount(amountTotal, currency);

  const pdfBuffer = await generateDonationReceiptPdf({
    organizationName: "AVASC",
    organizationAddress: "Los Angeles, CA",
    donorName,
    donorEmail,
    amount: formattedAmount,
    dateOfDonation: donationDate,
    transactionId,
    paymentMethod: "Stripe",
    isMonthly: false,
    is501c3,
    ein: avascEin,
    goodsOrServicesStatement: "No goods or services were provided in exchange for this contribution.",
    supportEmail: process.env.AVASC_SUPPORT_EMAIL || "support@avasc.org",
    website: "https://www.avasc.org",
    receiptNumber,
  });

  await sendDonationConfirmationEmail({
    to: donorEmail,
    donorName,
    amount: formattedAmount,
    date: donationDate,
    transactionId,
    paymentMethod: "Stripe",
    receiptNumber,
    pdfBuffer,
    pdfFilename: `AVASC-Donation-Receipt-${receiptNumber}.pdf`,
    is501c3,
    ein: avascEin,
  });

  await markReceiptSent(donation.id, receiptNumber);
}

async function handleMonthlyDonation(event: Stripe.Event & { data: { object: Stripe.Checkout.Session } }) {
  const session = event.data.object;
  const donorEmail = getDonorEmail(session);
  if (!donorEmail) throw new Error("Missing donor email for monthly donation.");

  const donorName = getDonorName(session);
  const subscriptionId = getSubscriptionId(session);
  if (await alreadyProcessedMonthly(subscriptionId)) return;

  const donation = await createOrUpdateMonthlyDonation({
    donorName,
    donorEmail,
    sessionId: session.id,
    subscriptionId,
  });

  if (sendMonthlyConfirmation) {
    await sendMonthlyDonationThankYouEmail({ to: donorEmail, donorName });
  }

  await markMonthlyConfirmationSent(donation.id);
}

export async function POST(req: NextRequest) {
  if (!stripe || !webhookSecret) {
    return new NextResponse("Stripe webhook is not configured", { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new NextResponse("Missing stripe-signature header", { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe signature verification failed:", error);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  try {
    if (isCheckoutSessionCompleted(event)) {
      const donationKind = getDonationKind(event.data.object);
      if (donationKind === "one_time") {
        await handleOneTimeDonation(event);
      } else if (donationKind === "monthly") {
        await handleMonthlyDonation(event);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handling failed:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}
