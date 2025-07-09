"use client";

import { Trophy, Rocket, Medal, Target, Brain, Award } from "lucide-react";
import { FaXTwitter, FaGithub } from "react-icons/fa6";

import profile from "@/data/profile";
import { isSameDomain } from "@/lib/utils";

import { PreviewLink } from "../PreviewLink";

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
      <h2 className="text-foreground mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Beyond the Resume</h2>
      <p className="text-muted-foreground mb-8 text-sm">What doesn&apos;t fit on a CV, but matters just as much.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2">
        {highlights.map((item, idx) => {
          const Wrapper = item.link ? PreviewLink : "div";
          return (
            <Wrapper
              key={idx}
              href={item.link || ""}
              target={isSameDomain(item.link || "") ? "_self" : "_blank"}
              className={
                "group border-border flex items-start gap-4 rounded-lg border p-4 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
              }
            >
              <div className="bg-muted text-muted-foreground group-hover:text-foreground flex h-10 w-10 items-center justify-center rounded-lg transition-all">
                {item.icon}
              </div>
              {item.title}
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
