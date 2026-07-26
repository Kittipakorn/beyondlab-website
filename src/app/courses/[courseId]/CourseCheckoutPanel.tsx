"use client";

import { useState, type ChangeEvent } from "react";
import { PromptPayQr } from "@/app/components/beyondlab/PromptPayQr";

type CourseCheckoutPanelProps = {
  courseId: string;
  courseTitle: string;
  priceLabel: string;
  priceAmount: number;
  originalPrice: string;
  backendUrl: string;
};

function UploadIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M10 14V3M6.5 6.5 10 3l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 12v4h12v-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CourseCheckoutPanel({
  courseId,
  courseTitle,
  priceLabel,
  priceAmount,
  originalPrice,
  backendUrl,
}: CourseCheckoutPanelProps) {
  const [slipImage, setSlipImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSlipFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setStatusMessage("ไฟล์ต้องมีขนาดไม่เกิน 8 MB");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setSlipImage(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const handlePurchase = async () => {
    if (!slipImage) {
      setStatusMessage("กรุณาเลือกรูปสลิปชำระเงิน");
      return;
    }

    setUploading(true);
    setStatusMessage("");
    try {
      const response = await fetch(`${backendUrl}/api/user/purchase-course`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ courseId, slipImage }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "ไม่สามารถยืนยันการชำระเงินได้");
      window.location.assign(`/learn/${encodeURIComponent(courseId)}`);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-[24px] border border-[#e2d7cb] bg-white p-5 text-[#292725] shadow-[0_14px_38px_rgba(62,46,30,.07)]">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c65018]">สรุปการสั่งซื้อ</p>
      <h2 className="mt-2 text-lg font-bold">{courseTitle}</h2>

      <div className="mt-4 rounded-2xl border border-[#eadfce] bg-[#fffaf5] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[#292725]">รายละเอียดคอร์ส</p>
            <p className="mt-1 text-xs leading-5 text-[#7a7068]">ซื้อครั้งเดียว เข้าเรียนได้ทันทีหลังตรวจสลิปสำเร็จ</p>
            <p className="mt-1 text-xs leading-5 text-[#7a7068]">สิทธิ์ใช้งาน 6 เดือนนับจากวันสมัคร</p>
          </div>
          <span className="shrink-0 rounded-full bg-[#fff0e5] px-2.5 py-1 text-[10px] font-bold text-[#c65018]">เปิดรับสมัคร</span>
        </div>

        <div className="mt-4 border-t border-[#eadfce] pt-4">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="font-semibold text-[#6e645d]">ราคาปกติ</span>
            <span className="font-bold text-[#777] line-through">{originalPrice}</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-4 text-sm">
            <span className="font-semibold text-[#6e645d]">ราคา</span>
            <span className="font-bold text-[#292725]">{priceLabel}</span>
          </div>
          <div className="mt-4 flex items-end justify-between gap-4 border-t border-[#eadfce] pt-4">
            <span className="text-sm font-bold text-[#292725]">ยอดชำระ</span>
            <span className="text-4xl font-bold leading-none text-[#ea5b16]">{priceLabel}</span>
          </div>
        </div>
      </div>

      <p className="mt-4 rounded-2xl border border-[#f0d1bb] bg-[#fff4ec] px-4 py-3 text-sm font-semibold leading-6 text-[#a84313]">
        อัปโหลดสลิปภายใน 1 ชั่วโมงหลังโอน
      </p>

      <div className="mt-4 grid gap-4">
        <div className="mx-auto w-full max-w-[220px] rounded-2xl border border-[#eadfce] bg-[#fffaf5] p-3">
          <PromptPayQr amount={priceAmount} className="aspect-square w-full rounded-xl object-contain p-0 shadow-none" />
        </div>

        <div className="flex flex-col justify-between gap-3">
          <div className="rounded-2xl border border-[#eadfce] bg-[#fbf8f4] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7e75]">ช่องทางการชำระเงิน</p>
            <p className="mt-1 text-sm font-semibold text-[#292725]">ธนาคารกสิกรไทย</p>
            <p className="mt-1 text-base font-bold text-[#292725]">เลขบัญชี: 137-3-84805-7</p>
            <p className="mt-1 text-sm font-semibold text-[#514942]">ชื่อบัญชี: นายกิตติปกรณ์ สีนาค</p>
            <p className="mt-1 text-sm text-[#6e645d]">หลังโอน ส่งสลิป / ชื่อ-นามสกุล / ชื่อเล่น</p>
          </div>

          <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#d9cbbb] bg-white px-4 text-sm font-bold text-[#514942] transition hover:border-[#c65018] hover:text-[#c65018]">
            <UploadIcon />
            {slipImage ? "เปลี่ยนรูปสลิป" : "เลือกสลิปชำระเงิน"}
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleSlipFileChange} className="sr-only" />
          </label>
        </div>
      </div>

      {slipImage ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-[#eadfce] bg-[#fbf8f4] p-3">
          <img src={slipImage} alt="ตัวอย่างสลิปที่เลือก" className="h-40 w-full rounded-xl object-contain" />
        </div>
      ) : null}

      {statusMessage ? <p className="mt-4 text-sm font-semibold text-[#c65018]">{statusMessage}</p> : null}

      <button
        type="button"
        onClick={handlePurchase}
        disabled={uploading || !slipImage}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#ea721f] px-5 text-sm font-bold text-white transition hover:bg-[#d96217] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? "กำลังตรวจสอบ..." : "ยืนยันการชำระเงิน"}
      </button>
    </div>
  );
}
