"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type RegisterFormProps = {
  returnTo: "/grader" | "/ide";
  backendUrl: string;
};

export function RegisterForm({ returnTo, backendUrl }: RegisterFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password.length < 8 || password.length > 12 ||
        !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("รหัสผ่านต้องมี 8–12 ตัว และประกอบด้วยตัวเล็ก ตัวใหญ่ และตัวเลข");
      return;
    }
    if (password !== confirmPassword) {
      setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          email: formData.get("email"),
          password,
          returnTo,
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        redirectTo?: string;
      };

      if (!response.ok) {
        setError(result.error ?? "ไม่สามารถสมัครสมาชิกได้");
        return;
      }

      router.replace(result.redirectTo ?? returnTo);
      router.refresh();
    } catch {
      setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองอีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label htmlFor="username" className="mb-2 block text-sm font-semibold text-[#5c5148]">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          minLength={3}
          maxLength={32}
          pattern="[A-Za-z0-9._-]+"
          required
          autoFocus
          className="h-12 w-full rounded-2xl border border-[#e4d7c6] bg-white px-4 text-[#303030] outline-none transition placeholder:text-[#a49a91] focus:border-[#ea721f] focus:ring-4 focus:ring-[#ea721f]/10"
          placeholder="your-username"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-[#5c5148]"
        >
          อีเมล
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
          className="h-12 w-full rounded-2xl border border-[#e4d7c6] bg-white px-4 text-[#303030] outline-none transition placeholder:text-[#a49a91] focus:border-[#ea721f] focus:ring-4 focus:ring-[#ea721f]/10"
          placeholder="name@example.com"
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
          autoComplete="new-password"
          minLength={8}
          maxLength={12}
          pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,12}"
          required
          className="h-12 w-full rounded-2xl border border-[#e4d7c6] bg-white px-4 text-[#303030] outline-none transition placeholder:text-[#a49a91] focus:border-[#ea721f] focus:ring-4 focus:ring-[#ea721f]/10"
          placeholder="8–12 ตัว: a-z, A-Z และ 0-9"
          aria-describedby="password-requirements"
        />
        <p id="password-requirements" className="mt-2 text-xs leading-5 text-[#766b61]">
          รหัสผ่านต้องมี 8–12 ตัว และประกอบด้วยตัวพิมพ์เล็กตัว, พิมพ์ใหญ่, และตัวเลข
        </p>
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-semibold text-[#5c5148]"
        >
          ยืนยันรหัสผ่าน
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={12}
          required
          className="h-12 w-full rounded-2xl border border-[#e4d7c6] bg-white px-4 text-[#303030] outline-none transition placeholder:text-[#a49a91] focus:border-[#ea721f] focus:ring-4 focus:ring-[#ea721f]/10"
          placeholder="กรอกรหัสผ่านอีกครั้ง"
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
        {isSubmitting ? "กำลังสร้างบัญชี..." : "สร้างบัญชี"}
      </button>
      <p className="text-center text-sm text-[#6f655d]">
        มีบัญชีแล้ว?{" "}
        <Link
          href={`/login?returnTo=${encodeURIComponent(returnTo)}`}
          className="font-semibold text-[#d55d11] underline-offset-4 hover:underline"
        >
          เข้าสู่ระบบ
        </Link>
      </p>
    </form>
  );
}
