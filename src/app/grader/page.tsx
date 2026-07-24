import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { GraderWorkspace } from "./GraderWorkspace";

export const metadata: Metadata = {
  title: "Grader | BeyondLab",
  description: "ฝึกเขียนโปรแกรม ทำโจทย์ และตรวจคำตอบได้ในที่เดียวกับ BeyondLab Grader",
};

export default async function GraderPage() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

  try {
    const healthResponse = await fetch(`${backendUrl}/health`, {
      cache: "no-store",
    });
    if (!healthResponse.ok) throw new Error("Backend health check failed");
  } catch {
    return (
      <section className="grid min-h-screen place-items-center bg-[#f7f3ed] p-5">
        <div className="w-full max-w-md rounded-3xl border border-[#eadfce] bg-white p-8 text-center shadow-[0_18px_50px_rgba(62,46,30,.10)]">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#fff0df] text-[#d85f13]" aria-hidden="true">
            <span className="text-2xl">›_</span>
          </span>
          <h1 className="mt-5 text-xl font-bold text-[#292725]">เซิร์ฟเวอร์มีปัญหา</h1>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#71675f]">
            {"สัญญาณขาดหาย สงสัยพี่มิคค์เดินเตะปลั๊กไฟ\nพักหน้าจอสักครู่ แล้วค่อยมาลองใหม่อีกครั้งนะ"}
          </p>
          <a
            href="/grader"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#ea721f] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(234,114,31,.25)] transition hover:bg-[#d85f13]"
          >
            ลองใหม่อีกครั้ง
          </a>
        </div>
      </section>
    );
  }

  const session = await requireSession("/grader");
  return (
    <GraderWorkspace
      username={session.username}
      email={session.email}
      backendUrl={backendUrl}
    />
  );
}
