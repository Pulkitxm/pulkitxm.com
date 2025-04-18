import "./globals.css";
import { GeistSans } from "geist/font/sans";
import NextTopLoader from "nextjs-toploader";
import { Fragment } from "react";

import assets from "@/assets";
import ChatWidget from "@/components/ChatWidget";
import Navbar from "@/components/Navbar";
import RedirectPopup from "@/components/RedirectPopup";
import FloatingCTA from "@/components/ui/floating-cta";
import { NEXT_PUBLIC_API_URL } from "@/lib/constants";
import { PostHogProvider } from "@/providers/posthog";

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(NEXT_PUBLIC_API_URL),
  title: {
    default: "Pulkit | Full-Stack Developer & Tech Enthusiast",
    template: "%s | Pulkit - Developer"
  },
  description:
    "I'm Pulkit, a full-stack developer specializing in modern web technologies. Explore my portfolio featuring React, TypeScript, and API integration projects. Outside coding, I enjoy connecting with friends and staying updated with the latest tech trends.",
  keywords: [
    "Pulkit",
    "web developer",
    "full-stack developer",
    "React developer",
    "TypeScript",
    "JavaScript",
    "portfolio",
    "tech projects"
  ],
  authors: [{ name: "Pulkit" }],
  creator: "Pulkit",
  publisher: "Pulkit",
  openGraph: {
    title: "Pulkit | Full-Stack Developer & Tech Enthusiast",
    description: "Explore Pulkit's portfolio showcasing innovative web development projects and technical expertise.",
    url: NEXT_PUBLIC_API_URL,
    siteName: "Pulkit's Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: assets.banner.home.src,
        width: 1200,
        height: 630,
        alt: "Pulkit's Developer Portfolio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulkit | Full-Stack Developer & Tech Enthusiast",
    description: "Explore Pulkit's portfolio showcasing innovative web development projects and technical expertise.",
    creator: "@pulkitxm",
    images: [assets.banner.home.src]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  alternates: {
    canonical: NEXT_PUBLIC_API_URL
  },
  verification: {
    // Add your verification tokens if available
    // google: "your-google-verification-token",
    // yandex: "your-yandex-verification-token",
  },
  category: "technology"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDevMode = process.env.NODE_ENV === "development";
  const Wrapper = isDevMode ? Fragment : PostHogProvider;
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body className={`${GeistSans.className} dark min-h-screen`}>
        <Wrapper>
          <FloatingCTA />
          <NextTopLoader
            color="#00d72d"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #2299DD,0 0 5px #2299DD"
          />
          <div className="mx-auto py-5 md:w-[800px] md:max-w-[800px] lg:py-8">
            <Navbar />
            <ChatWidget />
            {children}
            <RedirectPopup />
          </div>
        </Wrapper>
      </body>
    </html>
  );
}
