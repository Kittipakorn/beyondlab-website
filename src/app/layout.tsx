import "./globals.css";

export const metadata = {
  title: "BeyondLab | Build Beyond Code",
  description: "แพลตฟอร์มเรียนเขียนโปรแกรมและ ecosystem สำหรับนักสร้างยุค AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="transition-colors duration-500">
        {children}
      </body>
    </html>
  );
}
