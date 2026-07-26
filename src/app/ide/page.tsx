import type { Metadata } from "next";
import { requireCompleteProfile } from "@/lib/auth";
import { ScratchpadIde } from "./ScratchpadIde";

export const metadata: Metadata = {
  title: "IDE Playground | BeyondLab",
  description: "พื้นที่เขียนและทดลองรันโค้ดแบบอิสระของ BeyondLab",
};

export default async function IdePage() {
  const session = await requireCompleteProfile("/ide");
  return (
    <ScratchpadIde
      username={session.username}
      email={session.email}
      backendUrl={
        process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000"
      }
    />
  );
}
