import type { Metadata } from "next";
import { Noto_Sans_TC } from "@next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

// 設定字體
const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "ePunch點點班",
  description: "上下班打卡系統",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={notoSansTC.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
