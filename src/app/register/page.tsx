import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getReturnToLabel, getSafeReturnTo } from "@/lib/safeReturnTo";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "สมัครสมาชิก | BeyondLab",
  description: "สร้างบัญชี BeyondLab เพื่อใช้งาน Grader และ IDE",
};

type RegisterPageProps = {
  searchParams: Promise<{ returnTo?: string }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const { returnTo: requestedReturnTo } = await searchParams;
  const returnTo = getSafeReturnTo(requestedReturnTo);
  const session = await getSession();
  if (session) {
    redirect(returnTo);
  }

  return (
    <section className="px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-md rounded-[2rem] border border-[#eadfce] bg-white/95 p-6 shadow-[0_24px_70px_rgba(77,60,43,0.12)] sm:p-8">
        <div className="inline-flex rounded-full bg-[#fff1e6] px-3 py-1 text-xs font-bold tracking-[0.08em] text-[#d55d11]">
          ขั้นตอน 1 จาก 2
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#303030]">
          สมัครสมาชิก
        </h1>
        <p className="mt-2 leading-6 text-[#6f655d]">
          สร้างบัญชีเพื่อไปยัง {getReturnToLabel(returnTo)}
        </p>
        <RegisterForm returnTo={returnTo} />
      </div>
    </section>
  );
}
