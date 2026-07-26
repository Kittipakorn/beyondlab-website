import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth";
import { getSafeReturnTo } from "@/lib/safeReturnTo";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const returnTo = getSafeReturnTo(url.searchParams.get("returnTo"));
  const redirectTo = `/login?returnTo=${encodeURIComponent(returnTo)}`;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });

  const response = request.headers.get("accept")?.includes("application/json")
    ? NextResponse.json({ success: true, redirectTo })
    : NextResponse.redirect(new URL(redirectTo, request.url), 303);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
