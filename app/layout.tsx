/**
 * ROOT LAYOUT
 * Main layout with providers, smooth scroll, and cursor follow
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/animations/SmoothScroll";
import CursorFollow from "@/components/animations/CursorFollow";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Global Trotter - Plan Your Perfect Trip",
  description: "Premium trip planning platform with AI-powered itineraries and cinematic user experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CursorFollow />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
