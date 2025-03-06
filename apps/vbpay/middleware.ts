import { NextResponse, type NextRequest } from "next/server";

import { SigninPage } from "./routes";
import { authenticatedUser } from "./utils/amplify-server-utils";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const user = await authenticatedUser({ request, response });

  const isOnSignInPage = request.nextUrl.pathname.startsWith("/sign-in");

  if (isOnSignInPage) {
    // If the user is signed in, redirect them away from the sign in page
    if (user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    // If the user is not on the sign in page and is not signed in, redirect them to the sign in page
    if (!user) {
      return NextResponse.redirect(new URL(SigninPage({}), request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
