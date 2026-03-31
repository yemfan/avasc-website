/** Paths for files in `public/images` (URL-encoded where filenames contain spaces). */
export const brandImages = {
  mark64: "/images/AVASC64.svg",
  mark180: "/images/AVASC180.svg",
  logoFull: "/images/avasc-logo-full.svg",
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
