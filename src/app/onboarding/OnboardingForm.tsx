"use client";

import { useState, type FormEvent } from "react";
import type { SafeReturnTo } from "@/lib/safeReturnTo";

type OnboardingFormProps = {
  returnTo: SafeReturnTo;
  initialUsername: string;
  initialFirstName: string;
  initialLastName: string;
};

export function OnboardingForm({
  returnTo,
  initialUsername,
  initialFirstName,
  initialLastName,
}: OnboardingFormProps) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: String(formData.get("username") ?? "").trim(),
          firstName: String(formData.get("firstName") ?? "").trim(),
          lastName: String(formData.get("lastName") ?? "").trim(),
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(result.error ?? "ไม่สามารถตั้งค่าโปรไฟล์ได้");
        return;
      }

      window.location.replace(returnTo);
    } catch {
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองอีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-semibold text-[#5c5148]">
          ชื่อผู้ใช้
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          defaultValue={initialUsername}
          minLength={3}
          maxLength={32}
          pattern="[A-Za-z0-9._-]+"
          title="ชื่อผู้ใช้ต้องมี 3–32 ตัว ใช้ a-z, 0-9, จุด, ขีดกลาง หรือขีดล่าง"
          required
          autoFocus={!initialUsername}
          className="h-12 w-full rounded-2xl border border-[#e4d7c6] bg-white px-4 text-base text-[#303030] outline-none transition placeholder:text-[#a49a91] focus:border-[#ea721f] focus:ring-4 focus:ring-[#ea721f]/10"
          placeholder="your-username"
          aria-describedby="username-help"
        />
        <p id="username-help" className="mt-1.5 text-xs leading-5 text-[#766b61]">
          3–32 ตัว ใช้ a-z, 0-9, จุด, - หรือ _
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-1.5 block text-sm font-semibold text-[#5c5148]">
            ชื่อ
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            defaultValue={initialFirstName}
            maxLength={80}
            required
            autoFocus={Boolean(initialUsername) && !initialFirstName}
            className="h-12 w-full rounded-2xl border border-[#e4d7c6] bg-white px-4 text-base text-[#303030] outline-none transition placeholder:text-[#a49a91] focus:border-[#ea721f] focus:ring-4 focus:ring-[#ea721f]/10"
            placeholder="ชื่อของคุณ"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="mb-1.5 block text-sm font-semibold text-[#5c5148]">
            นามสกุล
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            defaultValue={initialLastName}
            maxLength={80}
            required
            autoFocus={Boolean(initialUsername && initialFirstName) && !initialLastName}
            className="h-12 w-full rounded-2xl border border-[#e4d7c6] bg-white px-4 text-base text-[#303030] outline-none transition placeholder:text-[#a49a91] focus:border-[#ea721f] focus:ring-4 focus:ring-[#ea721f]/10"
            placeholder="นามสกุลของคุณ"
          />
        </div>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#303030] px-5 font-semibold text-white shadow-[0_12px_28px_rgba(48,48,48,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1f1f1f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ea721f] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
      >
        {isSubmitting ? "กำลังบันทึก..." : "บันทึกและเริ่มใช้งาน"}
      </button>
    </form>
  );
}
