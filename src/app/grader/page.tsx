import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { GraderWorkspace } from "./GraderWorkspace";

export const metadata: Metadata = {
  title: "Grader | BeyondLab",
  description: "ฝึกเขียนโปรแกรม ทำโจทย์ และตรวจคำตอบได้ในที่เดียวกับ BeyondLab Grader",
};

export default async function GraderPage() {
  const session = await requireSession("/grader");
  return (
    <GraderWorkspace
      username={session.username}
      email={session.email}
      backendUrl={
        process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000"
      }
    />
  );
}
