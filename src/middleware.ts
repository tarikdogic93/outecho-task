import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import { AUTH_COOKIE } from "@/constants";

export async function middleware(request: NextRequest) {
  const homePage = "/";
  const signInPage = "/sign-in";
  const signUpPage = "/sign-up";

  const isSignInOrSignUp =
    request.url.includes(signInPage) || request.url.includes(signUpPage);

  if (request.url === new URL(homePage, request.url).toString()) {
    return NextResponse.next();
  }

  try {
    const authCookie = (await cookies()).get(AUTH_COOKIE);

    if (authCookie) {
      await jwtVerify(
        authCookie.value,
        new TextEncoder().encode(process.env.JWT_SECRET!),
      );

      if (isSignInOrSignUp) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else {
      if (!isSignInOrSignUp) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  } catch (error) {
    console.log(error);

    if (!isSignInOrSignUp) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
