"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import type { SafeReturnTo } from "@/lib/safeReturnTo";

type LoginFormProps = {
  returnTo: SafeReturnTo;
  backendUrl: string;
};

export function LoginForm({ returnTo, backendUrl }: LoginFormProps) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.get("identifier"),
          password: formData.get("password"),
          returnTo,
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        redirectTo?: string;
      };

      if (!response.ok) {
        setError(result.error ?? "ไม่สามารถเข้าสู่ระบบได้");
        return;
      }

      // A full navigation remounts the persistent layout so Navbar and every
      // session-dependent client component read the newly issued cookie.
      window.location.replace(result.redirectTo ?? returnTo);
    } catch {
      setError("ระบบกำลังมีปัญหา กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="identifier"
          className="mb-2 block text-sm font-semibold text-[#5c5148]"
        >
          ชื่อผู้ใช้หรืออีเมล
        </label>
        <input
          id="identifier"
          name="identifier"
          type="text"
          autoComplete="username"
          required
          autoFocus
          className="h-12 w-full rounded-2xl border border-[#e4d7c6] bg-white px-4 text-[#303030] outline-none transition placeholder:text-[#a49a91] focus:border-[#ea721f] focus:ring-4 focus:ring-[#ea721f]/10"
          placeholder="username หรือ name@example.com"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-[#5c5148]"
        >
          รหัสผ่าน
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-12 w-full rounded-2xl border border-[#e4d7c6] bg-white px-4 text-[#303030] outline-none transition placeholder:text-[#a49a91] focus:border-[#ea721f] focus:ring-4 focus:ring-[#ea721f]/10"
          placeholder="Password"
        />
      </div>
      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#303030] px-5 font-semibold text-white shadow-[0_12px_28px_rgba(48,48,48,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1f1f1f] disabled:cursor-wait disabled:opacity-60"
      >
        {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
      <p className="text-center text-sm text-[#6f655d]">
        ยังไม่มีบัญชี?{" "}
        <Link
          href={`/register?returnTo=${encodeURIComponent(returnTo)}`}
          className="font-semibold text-[#d55d11] underline-offset-4 hover:underline"
        >
          สมัครสมาชิก
        </Link>
      </p>
    </form>
  );
}
