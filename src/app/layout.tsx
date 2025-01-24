import "./globals.css";
import { GeistSans } from "geist/font/sans";

import Navbar from "@/components/Navbar";
import ScrollToTopButton from "@/components/ScrollTopTop";
import FloatingCTA from "@/components/ui/floating-cta";
import assets from "@/data/assets";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Pulkit - Developer",
    template: "%s | Pulkit - Developer"
  },
  description:
    "I'm Pulkit, a technology enthusiast with a passion for exploring the digital landscape. While I'm not diving into code or navigating through APIs, you'll often find me having fun with friends and family. I also enjoy watching TV shows, and I often read tech blogs. Balancing my technical skills with creativity and introspection fuels my journey in both professional and personal endeavors.",
  openGraph: {
    title: "Pulkit - Developer",
    description: "Explore Pulkit's portfolio, projects, and insights into web development.",
    url: "https://devpulkit.in",
    type: "website",
    images: [
      {
        url: assets.banner.home,
        width: 1200,
        height: 630,
        alt: "Pulkit's Portfolio Banner"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulkit - Developer",
    description: "Explore Pulkit's portfolio, projects, and insights into web development.",
    images: [assets.banner.home]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body className={`${GeistSans.className} dark min-h-screen`}>
        <FloatingCTA />
        <div className="mx-auto py-5 md:w-[800px] md:max-w-[800px] lg:py-8">
          <Navbar />
          {children}
          <ScrollToTopButton />
        </div>
      </body>
    </html>
  );
}
