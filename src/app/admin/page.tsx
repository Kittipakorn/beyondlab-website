import type { Metadata } from "next";
import { AdminDashboard } from "./AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Portal | BeyondLab",
  description: "หน้าจัดการระบบแอดมิน BeyondLab - จัดการโจทย์ (CRUD) และกำหนดสิทธิ์ผู้ใช้งาน (Role Assignment)",
};

export default function AdminPage() {
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

  return <AdminDashboard backendUrl={backendUrl} />;
}
