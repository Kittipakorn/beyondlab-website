import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { SafeReturnTo } from "./safeReturnTo";

export const SESSION_COOKIE_NAME = "beyondlab_session";

type SessionPayload = {
  username: string;
  email: string;
  expiresAt: number;
};

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function verifySessionToken(token: string | undefined) {
  const secret = process.env.AUTH_SECRET;

  if (!secret || !token) {
    return null;
  }

  const [encodedPayload, signature, extra] = token.split(".");

  if (!encodedPayload || !signature || extra) {
    return null;
  }

  const expectedSignature = sign(encodedPayload, secret);

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as SessionPayload;

    if (
      typeof payload.username !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt <= Date.now()
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}

export async function requireSession(returnTo: SafeReturnTo) {
  const session = await getSession();

  if (!session) {
    redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }

  return session;
}

type ProfileStatusResponse = {
  user?: {
    profileIncomplete?: boolean;
  };
};

export async function requireCompleteProfile(returnTo: SafeReturnTo) {
  const session = await requireSession(returnTo);

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";
    const cookieHeader = (await cookies()).toString();
    const response = await fetch(`${backendUrl}/auth/session`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });

    if (response.ok) {
      const profile = (await response.json()) as ProfileStatusResponse;
      if (profile.user?.profileIncomplete) {
        redirect(`/onboarding?returnTo=${encodeURIComponent(returnTo)}`);
      }
    }
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    console.error("Unable to verify profile completion", error);
  }

  return session;
}
