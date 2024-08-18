import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeWrapper from "@/components/ui/ThemeWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ruby Dashboard",
  description: "AI Based complaint tracking, and budget forecasting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} dark:bg-gray-900 dark:text-gray-100`}
      >
        <ThemeWrapper>{children}</ThemeWrapper>
      </body>
    </html>
  );
}
