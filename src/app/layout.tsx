import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/sidebar";
import { createClient } from "@/utils/supabase/server";
import { ThemeProvider } from "@/components/themeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prismo AI",
  description: "Advanced Content Analysis Platform",
  icons: {
    icon: "/prismo-logo.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground h-screen overflow-hidden`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex h-screen w-screen overflow-hidden">
            {user && <Sidebar />}
            <main className="flex-1 flex flex-col overflow-y-auto bg-background">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
