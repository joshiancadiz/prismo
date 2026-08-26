import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  metadataBase: new URL("https://prismo-ai.vercel.app"),
  title: "Prismo AI",
  description:
    "Extract transcripts from YouTube videos and shorts, then translate, enhance, and paraphrase them with AI. A practical repurposing tool for content creators.",
  keywords: [
    "YouTube transcript extractor",
    "AI transcript tool",
    "video transcript translation",
    "content creator tools",
    "AI paraphrasing",
    "YouTube shorts transcript",
  ],
  openGraph: {
    title: "Prismo AI",
    description:
      "Extract, translate, enhance, and paraphrase YouTube transcripts with AI. Best for repurposing content.",
    url: "https://prismo-ai.vercel.app", // swap for your actual domain
    siteName: "Prismo AI",
    images: [
      {
        url: "/prismo-image.png",
        width: 1200,
        height: 630,
        alt: "Prismo AI — YouTube Transcript & AI Content Tool",
      },
    ],
    type: "website",
  },
  icons: {
    icon: "/prismo-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

