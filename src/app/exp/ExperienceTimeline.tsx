"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { MapPin, Briefcase } from "lucide-react";
import { useRef } from "react";

import { PreFetchUrl } from "@/components/PreFetchUrl";
import { PreviewLink } from "@/components/PreviewLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import profile from "@/data/profile";
import { getToday } from "@/lib/config";
import { formatDate, formatDuration } from "@/lib/utils";
import { EXP_TYPE } from "@/types/profile";

interface GroupedExperience {
  companyName: string;
  companyUrl?: string;
  logo?: { src: string };
  experiences: typeof profile.experience;
}

export default function ExperienceTimeline() {
  const experience = profile.experience;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const groupedExperiences = experience.reduce((acc: GroupedExperience[], exp) => {
    const existingGroup = acc.find((group) => group.companyName === exp.companyName);

    if (existingGroup) {
      existingGroup.experiences.push(exp);
    } else {
      acc.push({
        companyName: exp.companyName,
        companyUrl: exp.url,
        logo: exp.logo,
        experiences: [exp]
      });
    }

    return acc;
  }, []);

  groupedExperiences.forEach((group) => {
    group.experiences.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  });

  groupedExperiences.sort((a, b) => {
    const aLatest = a.experiences[0].startDate.getTime();
    const bLatest = b.experiences[0].startDate.getTime();
    return bLatest - aLatest;
  });

  const totalExperience = experience
    .filter((exp) => exp.expType !== EXP_TYPE.VOLUNTEER)
    .reduce((total, exp) => {
      const startDate = exp.startDate;
      const endDate = exp.endDate || getToday();

      let duration = endDate.getTime() - startDate.getTime();

      if (duration < 0) {
        duration = Math.abs(duration);
      }

      return total + duration;
    }, 0);

  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-16 flex flex-col items-center justify-center gap-2 text-center text-5xl font-bold tracking-tight"
      >
        <span className="text-primary">My Experience</span>
        <span className="muted-foreground text-xl">
          Total Professional Experience: {formatDuration(totalExperience)}
        </span>
      </motion.h1>

      <div className="relative" ref={containerRef}>
        <motion.div
          className="bg-border absolute top-0 bottom-0 left-0 w-0.5 dark:bg-gray-700"
          style={{ scaleY, transformOrigin: "top" }}
        />

        {groupedExperiences.map((group, groupIndex) => (
          <motion.div
            key={group.companyName}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: groupIndex * 0.1 }}
            className="relative mb-12 ml-8"
          >
            <div className="relative mb-6">
              <div className="border-primary bg-background absolute top-0 -left-10 h-6 w-6 rounded-full border-4 dark:bg-gray-900" />
              <div className="mb-4 flex items-center space-x-2">
                {group.logo && (
                  <img
                    src={group.logo.src || "/placeholder.svg"}
                    alt={`${group.companyName} logo`}
                    className="bg-background -mt-2 size-12 rounded-full border object-contain p-1 dark:bg-gray-900"
                  />
                )}
                <div>
                  <h2 className="text-foreground text-2xl font-bold">
                    <PreviewLink
                      href={group.companyUrl ?? ""}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="hover:underline"
                    >
                      {group.companyName}
                    </PreviewLink>
                  </h2>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {group.experiences.map((exp, expIndex) => (
                <div key={exp.slug} className="relative">
                  {group.experiences.length > 1 && expIndex < group.experiences.length - 1 && (
                    <div className="bg-border absolute top-full left-4 h-4 w-0.5 dark:bg-gray-600" />
                  )}

                  <Card className="bg-background relative ml-2 flex h-full flex-col border shadow-lg transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-900/20">
                    <CardHeader className="space-y-4">
                      <div className="flex items-start justify-between">
                        <Badge variant="outline" className="bg-muted text-foreground border">
                          {exp.expType.valueOf()}
                        </Badge>
                        <div className="muted-foreground flex items-center text-sm">
                          {formatDate(exp.startDate)} -{" "}
                          {exp.endDate ? (exp.endDate > getToday() ? "Present" : formatDate(exp.endDate)) : "Present"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-foreground text-xl font-bold">{exp.position}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="muted-foreground flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4" />
                        {exp.location}
                      </div>
                      <div className="muted-foreground flex items-center text-sm">
                        <Briefcase className="mr-2 h-4 w-4" />
                        {exp.roleType}
                      </div>
                      {exp.desc && (
                        <div className="bg-muted w-full rounded-md border p-4">
                          <p className="muted-foreground text-sm">{exp.desc}</p>
                        </div>
                      )}
                    </CardContent>
                    {exp.expDetails && (
                      <CardFooter className="mt-auto pt-6">
                        <Button className="bg-muted text-foreground hover:bg-accent w-full transition-colors" asChild>
                          <PreFetchUrl
                            href={`/exp/${exp.slug}`}
                            rel="noopener noreferrer"
                            className="flex items-center justify-center"
                          >
                            View more
                          </PreFetchUrl>
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
