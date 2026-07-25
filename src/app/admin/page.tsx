import type { Metadata } from "next";
import { AdminDashboard } from "./AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Portal | BeyondLab",
  description: "หน้าจัดการระบบแอดมิน BeyondLab - จัดการโจทย์ (CRUD) และกำหนดสิทธิ์ผู้ใช้งาน (Role Assignment)",
};

export default function AdminPage() {
  const backendUrl = "/api/proxy";

  return <AdminDashboard backendUrl={backendUrl} />;
}
