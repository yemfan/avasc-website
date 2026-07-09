"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

/**
 * Submit button for the "generate briefing" form. Uses `useFormStatus` so it shows
 * a pending state while the (long-running) server action streams the briefing.
 */
export function GenerateBriefingButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Generating…" : label}
    </Button>
  );
}
