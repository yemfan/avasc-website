import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { subscriptionSchema } from "@/lib/alerts/subscription-schema";

function normalizeEmail(email?: string) {
  return email?.trim().toLowerCase() || null;
}

function normalizePhone(phone?: string) {
  return phone?.trim().replace(/\s+/g, "") || null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = subscriptionSchema.safeParse({
      email: body.email,
      phone: body.phone,
      smsEnabled: body.smsEnabled,
      emailDaily: body.emailDaily,
      emailWeekly: body.emailWeekly,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;

      return NextResponse.json(
        {
          success: false,
          message: "Please correct the highlighted fields.",
          errors: {
            email: fieldErrors.email?.[0],
            phone: fieldErrors.phone?.[0],
            smsEnabled: fieldErrors.smsEnabled?.[0],
            emailDaily: fieldErrors.emailDaily?.[0],
            emailWeekly: fieldErrors.emailWeekly?.[0],
          },
        },
        { status: 400 }
      );
    }

    const email = normalizeEmail(parsed.data.email);
    const phone = normalizePhone(parsed.data.phone);

    const matchOr = [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])];
    const existing =
      matchOr.length > 0
        ? await prisma.subscription.findFirst({ where: { OR: matchOr } })
        : null;

    if (existing) {
      const updated = await prisma.subscription.update({
        where: { id: existing.id },
        data: {
          email,
          phone,
          smsEnabled: parsed.data.smsEnabled,
          emailDaily: parsed.data.emailDaily,
          emailWeekly: parsed.data.emailWeekly,
          isActive: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Your alert preferences have been updated.",
        subscriptionId: updated.id,
      });
    }

    const created = await prisma.subscription.create({
      data: {
        email,
        phone,
        smsEnabled: parsed.data.smsEnabled,
        emailDaily: parsed.data.emailDaily,
        emailWeekly: parsed.data.emailWeekly,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "You are now subscribed to AVASC alerts.",
      subscriptionId: created.id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 }
    );
  }
}
