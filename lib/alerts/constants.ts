/** Ignore duplicate pipeline runs for the same cluster within this window. */
export const ALERT_DEDUPE_WINDOW_MS = 6 * 60 * 60 * 1000;

/** Per-subscriber cooldown after a CRITICAL SMS. */
export const SMS_COOLDOWN_MS = 12 * 60 * 60 * 1000;

/** Hard cap on CRITICAL SMS per subscriber per rolling 24h (anti-spam). */
export const MAX_CRITICAL_SMS_PER_DAY = 3;
