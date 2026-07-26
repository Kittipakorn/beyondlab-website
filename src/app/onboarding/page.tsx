import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getReturnToLabel, getSafeReturnTo } from "@/lib/safeReturnTo";
import { OnboardingForm } from "./OnboardingForm";

export const metadata: Metadata = {
  title: "ตั้งค่าโปรไฟล์ | BeyondLab",
  description: "เพิ่มชื่อผู้ใช้ ชื่อ และนามสกุลเพื่อเริ่มใช้งาน BeyondLab",
};

type OnboardingPageProps = {
  searchParams: Promise<{ returnTo?: string }>;
};

type ProfileSession = {
  user?: {
    username?: string;
    firstName?: string;
    lastName?: string;
    profileIncomplete?: boolean;
  };
};

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const { returnTo: requestedReturnTo } = await searchParams;
  const returnTo = getSafeReturnTo(requestedReturnTo);
  await requireSession(returnTo);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";
  let username = "";
  let firstName = "";
  let lastName = "";
  let profileComplete = false;

  try {
    const cookieHeader = (await cookies()).toString();
    const response = await fetch(`${backendUrl}/auth/session`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });

    if (response.ok) {
      const profile = (await response.json()) as ProfileSession;
      const currentUsername = profile.user?.username?.trim() ?? "";
      username = /^user_[a-f0-9]{24}$/.test(currentUsername) ? "" : currentUsername;
      firstName = profile.user?.firstName?.trim() ?? "";
      lastName = profile.user?.lastName?.trim() ?? "";
      profileComplete = profile.user?.profileIncomplete === false;
    }
  } catch (error) {
    console.error("Unable to preload onboarding profile", error);
  }

  if (profileComplete) {
    redirect(returnTo);
  }

  return (
    <section className="px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-md rounded-[2rem] border border-[#eadfce] bg-white/95 p-6 shadow-[0_24px_70px_rgba(77,60,43,0.12)] sm:p-8">
        <div className="inline-flex rounded-full bg-[#fff1e6] px-3 py-1 text-xs font-bold tracking-[0.08em] text-[#d55d11]">
          ขั้นตอน 2 จาก 2
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#303030]">
          ตั้งค่าโปรไฟล์
        </h1>
        <p className="mt-2 leading-6 text-[#6f655d]">
          ตั้งชื่อผู้ใช้และเพิ่มชื่อ–นามสกุลเพื่อเริ่มใช้งาน {getReturnToLabel(returnTo)}
        </p>
        <OnboardingForm
          returnTo={returnTo}
          initialUsername={username}
          initialFirstName={firstName}
          initialLastName={lastName}
        />
      </div>
    </section>
  );
}
