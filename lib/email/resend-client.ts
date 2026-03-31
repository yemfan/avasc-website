import { Resend } from "resend";

let cached: Resend | null = null;

/** Lazily construct Resend so importing email modules does not throw when RESEND_API_KEY is unset (e.g. `next build`). */
export function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("Missing RESEND_API_KEY");
  }
  if (!cached) {
    cached = new Resend(key);
  }
  return cached;
}
