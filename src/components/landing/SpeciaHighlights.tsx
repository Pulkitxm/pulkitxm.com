"use client";

import Link from "next/link";

import profile from "@/data/profile";
import { isSameDomain } from "@/lib/utils";

export default function SpecialHighlights() {
  const highlights: {
    title: string;
    emoji: string;
    link?: string;
  }[] = [
    { title: "340+ GitHub Followers", emoji: "💻", link: profile.links.github },
    { title: "1900+ X Followers", emoji: "🐦", link: profile.links.x },
    { title: "ICPC Regionals Amritapuri 2024", emoji: "🏆", link: "/events/icpc-amritapuri" },
    { title: "15+ Hackathons Participated", emoji: "🚀" },
    { title: "1st Prize (AI Track) at KRMU", emoji: "🥇", link: "/events/hackkrmu-hackathon" },
    { title: "Organized 36hr Campus Hackathon", emoji: "🎯", link: "https://devolympus.deviatorsdce.tech" },
    { title: "Mentored Students @ Deviators Club", emoji: "🧠" },
    { title: "AI Innovation Award by CM Haryana", emoji: "🏅", link: "/events/youth-day-x-univerity-ideathon" }
  ];

  return (
    <div className="mt-12 mb-6 rounded-xl">
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Beyond the Resume</h2>
      <p className="mb-8 text-sm text-gray-400">What doesn&apos;t fit on a CV, but matters just as much.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
        {highlights.map((item, idx) => {
          const Wrapper = item.link ? Link : "div";
          return (
            <Wrapper
              key={idx}
              href={item.link || ""}
              target={isSameDomain(item.link || "") ? "_self" : "_blank"}
              className={`group flex items-start gap-3 rounded-lg border border-gray-700 p-4 transition-all ${item.link ? "hover:border-gray-600 hover:bg-gray-800/20" : ""}`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800/50 text-xl transition-all group-hover:bg-gray-700/50">
                {item.emoji}
              </div>
              <div className="text-base font-medium text-gray-200 group-hover:text-white">{item.title}</div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
