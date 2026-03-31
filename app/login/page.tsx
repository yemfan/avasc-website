"use client";

import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
      <p className="mt-2 text-sm text-slate-600">
        Use your AVASC account. New here?{" "}
        <Link className="font-medium text-slate-900 underline" href="/register">
          Create an account
        </Link>
        .
      </p>
      <LoginForm />
    </div>
  );
}
