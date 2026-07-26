import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { getR2Course } from "@/lib/r2Course";
import { LearningWorkspace } from "./LearningWorkspace";

export const metadata: Metadata = {
  title: "ห้องเรียน | BeyondLab",
  description: "ดูวิดีโอบทเรียนและเอกสารประกอบคอร์ส BeyondLab",
};

function CourseUnavailable({ notConfigured }: { notConfigured: boolean }) {
  return (
    <section className="mx-auto grid min-h-[70dvh] max-w-7xl place-items-center px-5 py-16 sm:px-8">
      <div
        role="alert"
        className="w-full max-w-lg rounded-[28px] border border-[#eadfce] bg-white p-8 text-center shadow-[0_18px_50px_rgba(62,46,30,.10)]"
      >
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#fff0df] text-[#d85f13]" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
            <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
            <path d="m10 9 5 3-5 3V9Z" />
          </svg>
        </span>
        <h1 className="mt-5 text-2xl font-bold text-[#292725]">
          {notConfigured ? "ยังไม่ได้เชื่อม Cloudflare R2" : "โหลดบทเรียนไม่สำเร็จ"}
        </h1>
        <p className="mt-3 text-base leading-7 text-[#71675f]">
          {notConfigured
            ? "เพิ่ม R2_PUBLIC_URL และอัปโหลด course manifest ตามตัวอย่างในไฟล์ environment แล้วเปิดหน้านี้อีกครั้ง"
            : "กรุณาตรวจสอบว่า metadata manifest เปิดอ่านได้ และ backend เชื่อม private R2 video bucket สำเร็จ แล้วลองใหม่อีกครั้ง"}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/account" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#ded2c6] px-5 text-sm font-bold text-[#504841] transition hover:border-[#c65018] hover:text-[#c65018] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea721f] focus-visible:ring-offset-2">
            กลับไปบัญชีของฉัน
          </Link>
          <a href="/learn" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#ea721f] px-5 text-sm font-bold text-white transition hover:bg-[#cf5d12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea721f] focus-visible:ring-offset-2">
            ลองใหม่
          </a>
        </div>
      </div>
    </section>
  );
}

export default async function LearnPage() {
  const session = await requireSession("/learn");
  let studentName = session.username;

  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";
    const cookieHeader = (await cookies()).toString();
    const profileResponse = await fetch(`${backendUrl}/auth/session`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });
    const profile = (await profileResponse.json().catch(() => null)) as {
      user?: { firstName?: unknown; lastName?: unknown };
    } | null;
    const firstName =
      typeof profile?.user?.firstName === "string"
        ? profile.user.firstName.trim()
        : "";
    const lastName =
      typeof profile?.user?.lastName === "string"
        ? profile.user.lastName.trim()
        : "";
    studentName = [firstName, lastName].filter(Boolean).join(" ") || studentName;
  } catch {
    // Keep the username as a safe fallback if the profile endpoint is unavailable.
  }

  try {
    const course = await getR2Course();
    return (
      <LearningWorkspace
        course={course}
        studentName={studentName}
        studentEmail={session.email}
      />
    );
  } catch (error) {
    console.error("Unable to load course from R2", error);
    return <CourseUnavailable notConfigured={error instanceof Error && error.message === "R2_NOT_CONFIGURED"} />;
  }
}
