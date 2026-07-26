import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return NextResponse.json(
      { error: "กรุณาเข้าสู่ระบบก่อนแก้ไขข้อมูลบัญชี" },
      { status: 401 },
    );
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${BACKEND_URL}/api/user/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${SESSION_COOKIE_NAME}=${sessionToken}`,
      },
      body: await request.text(),
    });
  } catch {
    return NextResponse.json(
      { error: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองอีกครั้ง" },
      { status: 503 },
    );
  }

  const result = await backendResponse.json();
  if (!backendResponse.ok) {
    return NextResponse.json(result, { status: backendResponse.status });
  }

  if (result.token) {
    cookieStore.set(SESSION_COOKIE_NAME, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
  }

  const { token: _, ...safeResult } = result;
  return NextResponse.json(safeResult);
}
