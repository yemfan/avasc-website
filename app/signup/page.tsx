"use client";

import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Create account</h1>
      <p className="mt-2 text-sm text-slate-600">
        Already registered?{" "}
        <Link className="font-medium text-slate-900 underline" href="/login">
          Sign in
        </Link>
        .
      </p>
      <RegisterForm />
    </div>
  );
}
