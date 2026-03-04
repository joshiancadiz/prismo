import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prismo",
  description: "Advanced Content Analysis Platform",
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{}>;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f5f5f5] text-[#101010] h-screen overflow-hidden`}
      >
        <Sidebar />
        <main className="pl-[calc(18%+20px)] pt-[10px] pr-[10px] pb-[10px] h-full flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
