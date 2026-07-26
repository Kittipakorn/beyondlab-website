import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AccountPageClient } from "./AccountPageClient";

export const metadata: Metadata = {
  title: "บัญชีของฉัน | BeyondLab",
  description: "พื้นที่ส่วนตัวสำหรับจัดการบัญชี คอร์ส ประวัติการซื้อ และสิทธิ์สมาชิก BeyondLab",
};

export default async function AccountPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?returnTo=/account");
  }

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

  return (
    <AccountPageClient
      username={session.username}
      email={session.email}
      backendUrl={backendUrl}
    />
  );
}
