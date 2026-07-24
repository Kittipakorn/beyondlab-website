import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

const allowedReturnTo = new Set(["/grader", "/ide"]);

export async function POST(request: Request) {
  const url = new URL(request.url);
  const requestedReturnTo = url.searchParams.get("returnTo") ?? "/grader";
  const returnTo = allowedReturnTo.has(requestedReturnTo) ? requestedReturnTo : "/grader";

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });

  const response = NextResponse.redirect(
    new URL(`/login?returnTo=${encodeURIComponent(returnTo)}`, request.url),
    303,
  );
  response.headers.set("Cache-Control", "no-store");
  return response;
}
