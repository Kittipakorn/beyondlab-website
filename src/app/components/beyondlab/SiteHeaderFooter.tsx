"use client";

import { usePathname } from "next/navigation";
import { FloatingContact } from "./FloatingContact";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

// Routes that have their own custom layout shell and should hide the main landing page topbar, footer, and floating contact
const HIDE_LAYOUT_PATHS = ["/admin", "/grader", "/ide"];

export function SiteHeaderFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = HIDE_LAYOUT_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (hideLayout) {
    return <main id="main-content" className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
