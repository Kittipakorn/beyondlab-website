import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

async function proxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  let { path } = await params;

  // If path starts with duplicate "api" (e.g. /api/proxy/api/admin/users), strip it
  if (path[0] === "api") {
    path = path.slice(1);
  }

  let backendPath: string;
  if (path.length === 1 && path[0] === "health") {
    backendPath = "/health";
  } else if (path[0] === "auth") {
    backendPath = `/${path.join("/")}`;
  } else {
    backendPath = `/api/${path.join("/")}`;
  }

  const url = new URL(backendPath, BACKEND_URL);
  url.search = request.nextUrl.search;

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  const headers = new Headers();
  headers.set("Content-Type", request.headers.get("Content-Type") ?? "application/json");
  if (sessionToken) {
    headers.set("Cookie", `${SESSION_COOKIE_NAME}=${sessionToken}`);
  }

  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    fetchOptions.body = await request.arrayBuffer();
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(url.toString(), fetchOptions);
  } catch (error) {
    console.error(`Backend unavailable: ${url.origin}`, error);
    return NextResponse.json(
      {
        error: "SERVER_UNAVAILABLE",
        message: "สัญญาณขาดหาย สงสัยพี่มิคค์เดินเตะปลั๊กไฟ\nพักหน้าจอสักครู่ แล้วค่อยมาลองใหม่อีกครั้งนะ",
      },
      { status: 503 },
    );
  }

  const responseHeaders = new Headers();
  const contentType = backendRes.headers.get("Content-Type");
  if (contentType) responseHeaders.set("Content-Type", contentType);

  return new NextResponse(backendRes.body, {
    status: backendRes.status,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;
export const HEAD = proxy;
export const OPTIONS = proxy;
