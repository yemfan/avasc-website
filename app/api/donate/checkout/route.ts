import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { donateCheckoutRequestSchema } from "@/lib/donate/checkout-schema";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2026-03-25.dahlia",
    })
  : null;

function getOrigin(req: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (env) return env;
  const origin = req.headers.get("origin")?.trim().replace(/\/$/, "");
  if (origin) return origin;
  return "http://localhost:3000";
}

export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = donateCheckoutRequestSchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg =
      Object.values(first).flat()[0] ?? parsed.error.flatten().formErrors[0] ?? "Invalid request";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }

  const data = parsed.data;
  const origin = getOrigin(req);

  if (data.donationType === "monthly") {
    const url = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_URL?.trim();
    if (!url) {
      return NextResponse.json(
        { ok: false, error: "Monthly giving is not configured yet. Please try again later." },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: true as const, url });
  }

  if (!stripe) {
    const fallback = process.env.NEXT_PUBLIC_STRIPE_DONATE_URL?.trim();
    if (!fallback) {
      return NextResponse.json(
        { ok: false, error: "One-time checkout is not configured yet. Please try again later." },
        { status: 503 }
      );
    }
    return NextResponse.json({
      ok: true as const,
      url: fallback,
      notice:
        "Using the default one-time link; enter your chosen amount on the payment page if the link supports it.",
    });
  }

  const amount = data.amount;
  const unitAmount = Math.round(amount * 100);
  if (unitAmount < 100) {
    return NextResponse.json({ ok: false, error: "Minimum amount is 1.00." }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: data.donorEmail,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: unitAmount,
            product_data: {
              name: "Donation to AVASC",
            },
          },
        },
      ],
      success_url: `${origin}/donate?thanks=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donate`,
      metadata: {
        donationType: "one_time",
        donorName: data.donorName?.trim() || "",
      },
    });

    if (!session.url) {
      return NextResponse.json({ ok: false, error: "Could not start checkout." }, { status: 500 });
    }

    return NextResponse.json({ ok: true as const, url: session.url });
  } catch (e) {
    console.error("Stripe checkout session error:", e);
    return NextResponse.json({ ok: false, error: "Payment provider error. Please try again." }, { status: 502 });
  }
}
