import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FloatingDock } from "@/components/floating-dock";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Brock - Find Your Dream Property | Buy, Sell & Rent Real Estate",
  description: "Discover thousands of verified properties across India. Buy, sell, rent, or invest in residential and commercial properties with confidence on Brock.",
  keywords: ["real estate", "property", "buy property", "rent property", "commercial property", "residential property", "India real estate", "Brock"],
  authors: [{ name: "Brock" }],
  openGraph: {
    title: "Brock - Find Your Dream Property",
    description: "Discover thousands of verified properties across India. Buy, sell, rent, or invest in residential and commercial properties.",
    url: "https://brock.co.in",
    siteName: "Brock",
    images: [
      {
        url: "/brock-logo.svg",
        width: 1200,
        height: 630,
        alt: "Brock Real Estate Platform",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brock - Find Your Dream Property",
    description: "Discover thousands of verified properties across India",
    images: ["/brock-logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <Header />
          <FloatingDock />
          {children}
          <Footer />
        </div>
        <Toaster />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}