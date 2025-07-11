import "./globals.css";
import { GeistSans } from "geist/font/sans";
import NextTopLoader from "nextjs-toploader";
import { Fragment } from "react";

import assets from "@/assets";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import RedirectPopup from "@/components/RedirectPopup";
import ScrollToTopButton from "@/components/ScrollTopTop";
import FloatingCTA from "@/components/ui/floating-cta";
import { NEXT_PUBLIC_API_URL } from "@/lib/constants";
import { PostHogProvider } from "@/providers/posthog";
import { ThemeProvider } from "@/providers/theme-provider";

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
    images: [assets.banner.home.src],
    creator: "@_pulkitxm"
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
    <html lang="en" suppressHydrationWarning>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
        <body
          className={`${GeistSans.className} selection:bg-primary/20 selection:text-primary-foreground dark:selection:bg-primary/30 min-h-screen bg-[#f5f3f2] dark:bg-gray-950`}
        >
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
            <div className="mx-auto mb-4 pt-5 md:mb-0 md:w-[800px] md:max-w-[800px] lg:py-8">
              <header>
                <Navbar />
              </header>
              <main
                className="rounded-lg border-gray-300 p-4 pb-0 sm:p-6 md:border lg:p-8 dark:border-gray-700"
                id="main-content"
                role="main"
                aria-label="Main content"
              >
                {children}
                <Footer />
              </main>
              <RedirectPopup />
              <ScrollToTopButton />
            </div>
          </Wrapper>
        </body>
      </ThemeProvider>
    </html>
  );
}
