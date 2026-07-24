import "./globals.css";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import { FloatingContact } from "./components/beyondlab/FloatingContact";
import { Footer } from "./components/beyondlab/Footer";
import { Navbar } from "./components/beyondlab/Navbar";

const title = "BeyondLab | ห้องทดลองของคนที่อยากก้าวข้ามขีดจำกัด";
const description =
  "BeyondLab ห้องทดลองของคนที่อยากก้าวข้ามขีดจำกัด รวมคอร์สเรียน รับปรึกษา QuizFlow และโปรเจกต์สำหรับคนที่อยากสร้างผลงานจริง";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
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

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-thai",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={ibmPlexSansThai.variable}>
      <body className="overflow-x-hidden bg-[#f3f4f6] font-sans text-[#303030] transition-colors duration-500">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#303030] focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          ข้ามไปยังเนื้อหา
        </a>
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),rgba(243,244,246,0.92)_56%,rgba(226,229,233,0.95))]" />
        <Navbar />
        <main id="main-content" className="min-h-screen">{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
