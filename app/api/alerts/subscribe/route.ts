import { NextRequest, NextResponse } from "next/server";
import { subscriptionSchema } from "@/lib/alerts/subscription-schema";
import { upsertSubscription } from "@/lib/subscriptions/upsert-subscription";

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

    const { pendingConfirmation, isNew } = await upsertSubscription(parsed.data);

    const message = pendingConfirmation
      ? "Almost there — check your email and click the confirmation link to start receiving alerts."
      : isNew
        ? "You are now subscribed to AVASC alerts."
        : "Your alert preferences have been updated.";

    return NextResponse.json({ success: true, pendingConfirmation, message });
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
