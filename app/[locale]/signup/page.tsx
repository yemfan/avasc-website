"use client";

import { Link } from "@/i18n/navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <h1 className="text-2xl font-semibold text-foreground">Create account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Already registered?{" "}
        <Link
          className="font-medium text-[var(--avasc-gold-light)] underline underline-offset-2 hover:text-[var(--avasc-gold)]"
          href="/login"
        >
          Sign in
        </Link>
        .
      </p>

      <div className="mt-6">
        <SocialAuthButtons />
      </div>

      <div className="my-6 flex items-center gap-3 text-xs text-[var(--avasc-text-muted)]">
        <span className="h-px flex-1 bg-[var(--avasc-border)]" />
        or sign up with email
        <span className="h-px flex-1 bg-[var(--avasc-border)]" />
      </div>

      <RegisterForm />
    </div>
  );
}
