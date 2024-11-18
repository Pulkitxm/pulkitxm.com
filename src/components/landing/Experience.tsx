"use client";

import { CalendarIcon, BriefcaseIcon } from "lucide-react";
import profile from "@/data/profile";
import Link from "next/link";

export default function Experience() {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="max-w-2xl pt-4 sm:pt-6">
      <h1 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
        Work Experience
      </h1>
      <p className="mb-8 text-sm text-gray-400">
        All my professional experiences as a shitty developer!
      </p>

      <div className="relative border-l-2 border-gray-700">
        {profile.experience
          .filter((exp) => exp.showOnHome)
          .map((exp, index) => {
            return (
              <div key={index} className="mb-5 ml-6 last:mb-0">
                <div className="absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-gray-700" />

                <div className="group relative flex flex-col gap-1 rounded-lg border border-gray-800 p-4 transition-all hover:border-gray-700 sm:p-6">
                  <Link
                    href={`/exp/${exp.slug}`}
                    className={`text-lg font-semibold text-white sm:text-xl ${
                      exp.url ? "underline underline-offset-4" : ""
                    }`}
                  >
                    {exp.companyName}
                  </Link>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex items-center text-sm text-gray-400 sm:text-base">
                      <BriefcaseIcon className="mr-1.5 h-4 w-4 text-gray-500" />
                      <span>{exp.position}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-400">
                      <CalendarIcon className="mr-1.5 h-4 w-4 text-gray-500" />
                      <span>
                        {formatDate(exp.startDate)} -{" "}
                        {exp.endDate ? formatDate(exp.endDate) : "Present"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
