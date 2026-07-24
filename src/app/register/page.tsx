import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
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
  const returnTo = requestedReturnTo === "/ide" ? "/ide" : "/grader";
  const session = await getSession();
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

  if (session) {
    redirect(returnTo);
  }

  return (
    <section className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-md rounded-[2rem] border border-[#eadfce] bg-white/95 p-7 shadow-[0_24px_70px_rgba(77,60,43,0.12)] sm:p-10">
        <div className="inline-flex rounded-full bg-[#fff1e6] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#d55d11]">
          Join BeyondLab
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#303030]">
          สมัครสมาชิก
        </h1>
        <p className="mt-3 leading-7 text-[#6f655d]">
          สร้างบัญชีเพื่อใช้งาน{" "}
          {returnTo === "/ide" ? "IDE Playground" : "BeyondLab Grader"}
        </p>
        <RegisterForm returnTo={returnTo} backendUrl={backendUrl} />
      </div>
    </section>
  );
}
