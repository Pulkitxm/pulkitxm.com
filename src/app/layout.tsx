import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistSans } from "geist/font/sans";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pulkit - Developer",
  description:
    "I'm Pulkit, a technology enthusiast with a passion for exploring the digital landscape. While I'm not diving into code or navigating through APIs, you'll often find me having fun with friends and family. I also enjoy watching TV shows, and I often read tech blogs. Balancing my technical skills with creativity and introspection fuels my journey in both professional and personal endeavors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        <meta
          name="description"
          content="Pulkit - Developer. Portfolio and projects showcasing my skills and work in web development."
        />
        <meta
          name="keywords"
          content="Pulkit, Developer, Web Development, React, Portfolio"
        />
        <meta name="author" content="Pulkit" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="Pulkit - Developer" />
        <meta
          property="og:description"
          content="Pulkit - Developer. Portfolio and projects showcasing my skills and work in web development."
        />
        {/* <meta
          property="og:image"
          content="https://devpulkit.in/path/to/image.jpg"
        /> */}
        <meta property="og:url" content="https://devpulkit.in" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Pulkit - Developer" />

        {/* Twitter Cards */}
        {/* <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pulkit - Developer" />
        <meta
          name="twitter:description"
          content="Pulkit - Developer. Portfolio and projects showcasing my skills and work in web development."
        />
        <meta
          name="twitter:image"
          content="https://devpulkit.in/path/to/image.jpg"
        />
        <meta name="twitter:site" content="@devpulkitt" /> */}

        {/* Canonical Tag */}
        <link rel="canonical" href="https://devpulkit.in" />

        {/* Title Tag */}
        <title>Pulkit - Developer</title>

        <link rel="icon" href="./favicon.png" />
      </head>
      <body className={`${inter.className} ${GeistSans.className}`}>
        <div className="mx-auto py-10 md:w-[800px] md:max-w-[800px]">
          <Navbar />
          {children}
        </div>
      </body>
      <Analytics debug={false} />
      <SpeedInsights debug={false} />
    </html>
  );
}
