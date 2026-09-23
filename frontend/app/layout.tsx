import type { Metadata } from "next";
import { Geist_Mono, Tenor_Sans, Urbanist } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tenorSans = Tenor_Sans({
  variable: "--font-tenor-sans",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "KINGJOEBRIDD",
  description: "A digital fashion house where inspiration becomes craftsmanship.",
};

import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${urbanist.variable} ${geistMono.variable} ${tenorSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-500">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
