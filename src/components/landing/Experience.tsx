import { CalendarIcon, BriefcaseIcon } from "lucide-react";
import Link from "next/link";

import { PreFetchUrl } from "@/components/PreFetchUrl";
import profile from "@/data/profile";
import { getToday } from "@/lib/config";
import { Experience as ExperienceType } from "@/types/profile";

import type { ElementType } from "react";

export default async function Experience() {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short"
    });
  };

  const experience = profile.experience
    .filter((exp) => exp.showOnHome)
    .reduce<
      Pick<
        ExperienceType,
        "companyName" | "position" | "startDate" | "endDate" | "logo" | "slug" | "showOnHome" | "expDetails"
      >[]
    >((acc, exp) => {
      const existingIndex = acc.findIndex((e) => e.slug === exp.slug);

      if (existingIndex !== -1) {
        acc[existingIndex] = {
          ...exp,
          endDate: acc[existingIndex].endDate
        };
      } else {
        acc.push({
          companyName: exp.companyName,
          position: exp.position,
          startDate: exp.startDate,
          endDate: exp.endDate,
          logo: exp.logo,
          slug: exp.slug,
          showOnHome: exp.showOnHome,
          expDetails: exp.expDetails
        });
      }

      return acc;
    }, []);

  return (
    <div className="max-w-2xl pt-4 sm:pt-6">
      <Link href="/exp" className="mb-2 text-2xl font-bold tracking-tight text-white hover:underline sm:text-3xl">
        Work Experience
      </Link>
      <p className="mb-8 text-sm text-gray-400">All my professional experiences as a shitty developer!</p>

      <div className="relative border-l-2 border-gray-700">
        {experience
          .filter((exp) => exp.showOnHome)
          .map((exp, index) => {
            const RenderCx: ElementType = exp.expDetails ? PreFetchUrl : "div";
            return (
              <RenderCx
                {...(exp.expDetails ? { href: `/exp/${exp.slug}` } : {})}
                key={index}
                className="mb-5 ml-6 block last:mb-0"
              >
                <div className="absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-gray-700" />

                <div
                  className={
                    "group relative flex flex-col gap-1 rounded-lg border border-gray-800 p-2 transition-all sm:p-4" +
                    (exp.expDetails ? " hover:border-gray-700" : "")
                  }
                >
                  <div className="flex items-center gap-3">
                    {exp.logo && (
                      <img
                        src={exp.logo.src || "/placeholder.svg"}
                        alt={`${exp.companyName} logo`}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-contain"
                      />
                    )}
                    <div className="flex flex-col gap-1">
                      <div className="text-lg font-semibold text-white sm:text-xl">{exp.position}</div>

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <div className="flex items-center text-sm text-gray-400 sm:text-base">
                          <BriefcaseIcon className="mr-1.5 h-4 w-4 text-gray-500" />
                          <span>{exp.companyName}</span>
                        </div>

                        <div className="flex items-center text-sm text-gray-400">
                          <CalendarIcon className="mr-1.5 h-4 w-4 text-gray-500" />
                          <span>
                            {formatDate(exp.startDate)} -{" "}
                            {exp.endDate ? (exp.endDate > getToday() ? "Present" : formatDate(exp.endDate)) : "Present"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </RenderCx>
            );
          })}
      </div>
    </div>
  );
}
