import "./globals.css";
import { FloatingContact } from "./components/beyondlab/FloatingContact";
import { Footer } from "./components/beyondlab/Footer";
import { Navbar } from "./components/beyondlab/Navbar";

const title = "BeyondLab | เรียนเขียนโปรแกรมโอลิมปิก C++";
const description =
  "BeyondLab ติวเข้มเขียนโปรแกรมโอลิมปิก C++ โดยพี่โมและพี่มิก วิศวะคอม (CEDT) จุฬาฯ ผู้แทนศูนย์ สอวน. โอลิมปิกคอมพิวเตอร์ 2 ปีซ้อน";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: "BeyondLab",
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="overflow-x-hidden bg-white font-sans text-[#111111] transition-colors duration-500">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_right,rgba(17,17,17,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,17,17,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
