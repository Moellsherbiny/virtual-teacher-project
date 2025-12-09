import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
 
// export default createMiddleware(routing);
 
export function proxy(request: NextRequest) {
 
}
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};