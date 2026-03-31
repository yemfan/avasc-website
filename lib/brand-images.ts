/** Paths for files in `public/images` (URL-encoded where filenames contain spaces). */
/** Favicons: `app/icon.png` = copy of `avasc64.png`; `app/apple-icon.png` = copy of `avasc180.png`. */
export const brandImages = {
  /** Small mark: nav/footer, favicon. */
  mark64: "/images/avasc64.png",
  /** Larger mark: About page, Apple touch. */
  mark180: "/images/avasc180.png",
  /** Full wordmark / hero logo (nav + home hero). */
  logoFull: "/images/avasc-logo-full.png",
} as const;

/** Display and accessibility copy aligned with official AVASC branding. */
export const brand = {
  shortName: "AVASC",
  legalName: "Association of Victims Against Cyber-Scams",
  /** Decorative mark (nav / footer): paired with visible “AVASC” text. */
  logoAltMark: "",
  /** Hero / standalone full logo. */
  logoAltFull:
    "AVASC — Association of Victims Against Cyber-Scams: shield, globe, and padlock wordmark logo",
  logoAltAbout:
    "AVASC emblem — shield with padlock and Association of Victims Against Cyber-Scams branding",
} as const;
