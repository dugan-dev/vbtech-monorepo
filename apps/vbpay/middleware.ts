import { NextResponse, type NextRequest } from "next/server";

import { SignIn } from "./routes";
import { authenticatedUser } from "./utils/amplify-server-utils";

export async function middleware(request: NextRequest) {
  console.log("middleware");
  const user = await authenticatedUser();

  const isOnSignInPage = request.nextUrl.pathname.startsWith("/sign-in");

  if (isOnSignInPage) {
    if (user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    // If the user is not on the sign in page and is not signed in, redirect them to the sign in page
    if (!user) {
      return NextResponse.redirect(new URL(SignIn({}), request.url));
    }
  }

  return NextResponse.next();
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
