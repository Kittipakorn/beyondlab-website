export function ReviewsMarquee() {
  const reviews = [
    {
      name: "น้องนนท์",
      role: "นักเรียน ม.ปลาย",
      service: "C++ Zero to Code",
      content: "พี่โมสอนดีมากครับ สอนตั้งแต่เริ่มศูนย์เลย ตอนนี้ทำโครงงานคอมพิวเตอร์ส่งครูได้สบายแล้วครับ"
    },
    {
      name: "น้องแก้ม",
      role: "ปี 1 วิศวะคอมฯ",
      service: "C++ Zero to Code",
      content: "คอร์ส C++ ช่วยให้เรียนในมหาลัยเข้าใจขึ้นเยอะมาก พี่มิคค์ใจดีอธิบายละเอียดและตอบคำถามตลอดเลยค่ะ"
    },
    {
      name: "คุณบอมบ์",
      role: "เปลี่ยนสายงาน",
      service: "ปรึกษาโปรเจกต์",
      content: "มาปรึกษาโปรเจกต์กับพี่ ๆ ได้คำแนะนำที่เป็นระบบและจับต้องได้จริง ช่วยประหยัดเวลาไปได้เยอะมากครับ"
    },
    {
      name: "น้องนิว",
      role: "เตรียมเข้ามหาลัย",
      service: "ปรึกษาโปรเจกต์",
      content: "ใครเตรียมทำพอร์ตยื่นเข้ามหาลัยแนะนำเลยครับ ได้โค้ดโปรเจกต์จริงคุณภาพดีและอธิบายกรรมการได้มั่นใจ"
    },
    {
      name: "น้องพี",
      role: "ปี 2 วิทยาการคอมฯ",
      service: "C++ Zero to Code",
      content: "เรียนสนุกมาก ไม่น่าเบื่อเลย มีโจทย์ท้าทายให้ทดลองทำจริงเยอะ ช่วยให้คิดเชิงลอจิกเป็นระบบดีครับ"
    },
    {
      name: "น้องมายด์",
      role: "มือใหม่ฝึกเขียนโค้ด",
      service: "C++ Zero to Code",
      content: "พี่ ๆ ดูแลเป็นกันเองมากค่ะ ติดปัญหาตรงไหนไลน์ไปถามก็ช่วยอธิบายให้เข้าใจทันที ประทับใจมากค่ะ"
    }
  ];

  return (
    <section className="relative overflow-hidden py-10 bg-transparent">
      <div className="px-5 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-[#ea721f]">Testimonials</p>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                ตัวอย่าง Demo
              </span>
            </div>
            <h2 className="mt-2 pt-1 text-2xl font-semibold leading-tight text-[#303030] sm:text-3xl">
              เสียงตอบรับจากผู้เรียนและผู้ใช้บริการ
            </h2>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
              ⚠️ รีวิวด้านล่างนี้เป็นข้อมูลตัวอย่างสำหรับทดสอบการแสดงผล ยังไม่ใช่รีวิวจริงจากผู้เรียน
            </p>
          </div>
        </div>
      </div>

      {/* แถบรีวิววิ่งแบบ Marquee พร้อมใช้ CSS Mask ไล่เฉดความโปร่งใสขอบซ้าย-ขวา ป้องกันปัญหาขอบตัด */}
      <div className="relative flex overflow-x-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        {/* แถวการ์ดรีวิว เลื่อนซ้ายวนซ้ำแบบอนันต์ */}
        <div className="flex gap-4 animate-marquee whitespace-nowrap">
          {[...reviews, ...reviews].map((review, index) => (
            <div
              key={index}
              className="inline-block w-[300px] shrink-0 whitespace-normal rounded-2xl border border-[#f0dfc8]/50 bg-white p-5 shadow-[0_8px_24px_rgba(48,48,48,0.04)] transition duration-350 hover:-translate-y-1 hover:border-[#ea721f]/60 hover:shadow-[0_16px_36px_rgba(48,48,48,0.08)]"
            >
              {/* แถวบนสุด: ดาว และ บริการที่ลงเรียน */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-3.5 w-3.5 fill-[#ea721f]" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="rounded-md bg-[#fff4df] px-2 py-0.5 text-[9px] font-bold text-[#ea721f]">
                  {review.service}
                </span>
              </div>
              
              {/* ความคิดเห็นรีวิว */}
              <p className="text-[13px] leading-6 text-[#5c5148] min-h-[72px]">
                &ldquo;{review.content}&rdquo;
              </p>

              {/* ข้อมูลผู้เขียน */}
              <div className="mt-4 border-t border-neutral-100 pt-3 flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#303030]">{review.name}</span>
                <span className="text-[10px] font-medium text-neutral-400">
                  {review.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
