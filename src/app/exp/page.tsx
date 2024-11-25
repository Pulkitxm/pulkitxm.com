"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Briefcase } from "lucide-react";
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
import { cn } from "@/lib/utils";
import profile from "@/data/profile";

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

export default function Component() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const experience = profile.experience;

  const filteredExperience = selectedType
    ? experience.filter((exp) => exp.type === selectedType)
    : experience;

  const uniqueTypes = Array.from(new Set(experience.map((exp) => exp.type)));

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

      <div className="mb-12 flex flex-wrap justify-center gap-3">
        <Button
          variant="outline"
          size="lg"
          className={cn(
            "border-gray-800 text-lg hover:bg-gray-800",
            selectedType === null && "bg-gray-800 text-white",
          )}
          onClick={() => setSelectedType(null)}
        >
          All
        </Button>
        {uniqueTypes.map((type) => (
          <Button
            key={type}
            variant="outline"
            size="lg"
            className={cn(
              "border-gray-800 text-lg hover:bg-gray-800",
              selectedType === type && "bg-gray-800 text-white",
            )}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </Button>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredExperience.map((exp, index) => {
          return (
            <motion.div
              key={exp.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="group relative flex h-full flex-col border-gray-800 transition-all duration-300 hover:border-gray-700 hover:shadow-xl hover:shadow-gray-900/20">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <Badge
                      variant="outline"
                      className="border-gray-700 bg-gray-800 text-white"
                    >
                      {exp.type}
                    </Badge>
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
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDate(exp.startDate)} -{" "}
                    {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Briefcase className="mr-2 h-4 w-4" />
                    {exp.type}
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
          );
        })}
      </div>
    </main>
  );
}
