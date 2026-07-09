import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

/**
 * Locale-aware navigation helpers. These wrap Next.js' primitives so hrefs
 * automatically carry the active locale prefix (`/es/...`, `/zh/...`) while
 * the default locale (`en`) stays unprefixed.
 *
 * NOTE: only these four are re-exported. `useSearchParams`, `notFound`,
 * `permanentRedirect`, `useParams`, etc. must still be imported from
 * `next/navigation`.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
