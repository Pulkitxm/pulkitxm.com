"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { MapPin, Briefcase } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import profile from "@/data/profile";

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

export default function ExperienceTimeline() {
  const experience = profile.experience;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-16 text-center text-5xl font-bold tracking-tight"
      >
        My Experience
      </motion.h1>

      <div className="relative" ref={containerRef}>
        {/* Timeline line */}
        <motion.div
          className="absolute bottom-0 left-0 top-0 w-0.5 bg-gray-700"
          style={{ scaleY, transformOrigin: "top" }}
        />

        {experience.map((exp, index) => (
          <motion.div
            key={exp.slug}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="relative mb-12 ml-8"
          >
            <div
              className={`absolute -left-10 top-0 h-6 w-6 rounded-full border-4 ${
                !exp.endDate
                  ? "border-green-500 bg-green-100"
                  : "border-gray-800 bg-gray-100"
              }`}
              title={exp.endDate ? undefined : "Ongoing"}
            />
            <Card className="group relative flex h-full flex-col border-gray-800 transition-all duration-300 hover:border-gray-700 hover:shadow-xl hover:shadow-gray-900/20">
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <Badge
                    variant="outline"
                    className="border-gray-700 bg-gray-800 text-white"
                  >
                    {exp.type}
                  </Badge>
                  <div className="text-sm text-gray-400">
                    {formatDate(exp.startDate)} -{" "}
                    {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </div>
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-white">
                    {exp.position}
                  </CardTitle>
                  <CardDescription className="text-base text-gray-400">
                    <Link
                      href={exp.url ?? ""}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="hover:underline"
                    >
                      {exp.companyName}
                    </Link>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-400">
                  <MapPin className="mr-2 h-4 w-4" />
                  {exp.location}
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Briefcase className="mr-2 h-4 w-4" />
                  {exp.type}
                </div>
                <div className="w-full rounded-md border p-4">
                  <p className="text-sm text-gray-400">{exp.desc}</p>
                </div>
              </CardContent>
              <CardFooter className="mt-auto pt-6">
                <Button
                  className="w-full bg-gray-800 text-white transition-colors hover:bg-gray-700"
                  asChild
                >
                  <Link
                    href={`/exp/${exp.slug}`}
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    View more
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
