"use client";

import { Trophy, Rocket, Medal, Target, Brain, Award } from "lucide-react";
import Link from "next/link";
import { FaXTwitter, FaGithub } from "react-icons/fa6";

import profile from "@/data/profile";
import { isSameDomain } from "@/lib/utils";

export default function SpecialHighlights() {
  const highlights: {
    title: string;
    icon: React.ReactNode;
    link?: string;
  }[] = [
    {
      title: "340+ GitHub Followers",
      icon: <FaGithub className="h-5 w-5" />,
      link: profile.links.github
    },
    {
      title: "1900+ X Followers",
      icon: <FaXTwitter className="h-5 w-5" />,
      link: profile.links.x
    },
    {
      title: "ICPC Regionals Amritapuri 2024",
      icon: <Trophy className="h-5 w-5" />,
      link: "/events/icpc-amritapuri"
    },
    {
      title: "15+ Hackathons Participated",
      icon: <Rocket className="h-5 w-5" />
    },
    {
      title: "1st Prize (AI Track) at KRMU",
      icon: <Medal className="h-5 w-5" />,
      link: "/events/hackkrmu-hackathon"
    },
    {
      title: "Organized 36hr Campus Hackathon",
      icon: <Target className="h-5 w-5" />,
      link: "https://devolympus.deviatorsdce.tech"
    },
    {
      title: "Mentored Students @ Deviators Club",
      icon: <Brain className="h-5 w-5" />
    },
    {
      title: "AI Innovation Award by CM Haryana",
      icon: <Award className="h-5 w-5" />,
      link: "/events/youth-day-x-univerity-ideathon"
    }
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
              className={`group relative flex items-start gap-4 rounded-lg border border-gray-700/50 p-4 backdrop-blur-sm transition-all ${item.link ? "hover:border-gray-600 hover:bg-gray-800/30" : ""}`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 text-gray-300 transition-all group-hover:from-gray-700 group-hover:to-gray-800 group-hover:text-white">
                {item.icon}
              </div>
              <div className="text-base font-medium text-gray-200 group-hover:text-white">{item.title}</div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
