import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except:
  // - /api (unlocalized API routes)
  // - /_next and /_vercel (framework internals)
  // - any path containing a dot (static files like /icon.png, /og-image.png)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
