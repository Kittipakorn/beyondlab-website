import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth";
import { getSafeReturnTo } from "@/lib/safeReturnTo";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

export async function POST(request: Request) {
  const body = await request.json();
  const returnTo = getSafeReturnTo(body.returnTo);

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, returnTo }),
    });
  } catch {
    return NextResponse.json(
      { error: "สัญญาณขาดหาย สงสัยพี่มิคค์เดินเตะปลั๊กไฟ\nพักหน้าจอสักครู่ แล้วค่อยมาลองใหม่อีกครั้งนะ" },
      { status: 503 },
    );
  }

  const result = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(result, { status: backendRes.status });
  }

  if (result.token) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
  }

  const { token: _, ...safeResult } = result;
  return NextResponse.json({ ...safeResult, redirectTo: returnTo });
}
