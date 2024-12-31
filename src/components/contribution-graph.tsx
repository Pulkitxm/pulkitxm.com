"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, GitPullRequest, ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GITHUB_DEFAULT_VIEW_YEAR,
  GITHUB_JOINED_DATE,
  GITHUB_START_CONTRIBUTION_YEAR,
  IGNORED_CONTRIBUTION_YEARS,
  TODAY
} from "@/lib/config";
import { months } from "@/lib/constants";
import { getGithubContributionData } from "@/lib/gh";
import { cn } from "@/lib/utils";
import { CONTRIBUTION } from "@/types/github";

const contributionLevels = [
  { min: 0, color: "bg-zinc-800 dark:bg-zinc-750" },
  { min: 1, color: "bg-emerald-700 dark:bg-emerald-600" },
  { min: 5, color: "bg-emerald-500 dark:bg-emerald-400" },
  { min: 10, color: "bg-emerald-400 dark:bg-emerald-300" },
  { min: 20, color: "bg-emerald-300 dark:bg-emerald-200" }
];

function getContributionColor(count: number) {
  const level = contributionLevels.findLast((level) => count >= level.min);
  return level ? level.color : contributionLevels[0].color;
}

export function ContributionGraph(): React.ReactElement {
  const currentYear = TODAY.getFullYear();
  const [data, setData] = useState<CONTRIBUTION | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(GITHUB_DEFAULT_VIEW_YEAR);
  const [showYearSelect, setShowYearSelect] = useState(false);

  useEffect(() => {
    fetchYearData(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showYearSelect && !(e.target as HTMLElement).closest(".year-select")) {
        setShowYearSelect(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showYearSelect]);

  const fetchYearData = async (year: number) => {
    setLoading(true);
    try {
      const newData = await getGithubContributionData(year);
      if (newData) setData(newData);
    } catch (error) {
      console.error("Failed to fetch year data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderMonth = (
    month: CONTRIBUTION["contributions"]["months"][number] | undefined,
    monthIndex: number,
    isLoading: boolean
  ) => {
    const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();
    const cells: React.ReactNode[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, monthIndex, day);
      const contributionDay =
        !isLoading && month?.days?.find((d) => new Date(d.date).toDateString() === date.toDateString());
      const contributionCount = contributionDay ? contributionDay.contributionCount : 0;

      cells.push(
        <motion.div
          key={date.toISOString()}
          initial={{ opacity: 1 }}
          animate={
            isLoading
              ? {
                  opacity: [0.3, 0.5, 0.3],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }
              : { opacity: 1 }
          }
        >
          <div
            className={cn(
              "m-[1px] h-[10px] w-[10px] rounded-[2px] transition-all duration-200 ease-in-out hover:scale-125 md:h-4 md:w-4",
              isLoading
                ? "bg-zinc-800/50"
                : date.toDateString() === TODAY.toDateString()
                  ? "bg-red-600"
                  : date.toDateString() === GITHUB_JOINED_DATE.toDateString()
                    ? "bg-amber-300"
                    : getContributionColor(contributionCount)
            )}
            title={
              date.toDateString() === GITHUB_JOINED_DATE.toDateString()
                ? "The day I joined GitHub"
                : date.toDateString() === TODAY.toDateString()
                  ? "let me contribut today :)"
                  : isLoading
                    ? "Loading..."
                    : `${contributionCount} contribution${contributionCount !== 1 ? "s" : ""} on ${date.toDateString()}`
            }
          />
        </motion.div>
      );
    }

    const remainingCells = 42 - daysInMonth;
    for (let i = 0; i < remainingCells; i++) {
      cells.push(<div key={`empty-end-${i}`} className="h-[10px] w-[10px] md:h-3 md:w-3" />);
    }

    return cells;
  };

  return (
    <Card className="w-full max-w-full border-zinc-700 bg-black/60 shadow-xl backdrop-blur-md md:max-w-6xl">
      <CardHeader className="border-b border-zinc-700 px-4 py-3 md:px-6">
        <CardTitle className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
          <span className="text-xl font-bold text-zinc-100 md:text-2xl">GitHub Contributions</span>
          <div className="year-select relative">
            <button
              onClick={() => setShowYearSelect(!showYearSelect)}
              className="flex items-center space-x-2 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 transition-colors hover:bg-zinc-700"
            >
              <span className="text-sm text-zinc-100">{selectedYear}</span>
              <ChevronDown className="h-4 w-4 text-zinc-300" />
            </button>
            <AnimatePresence>
              {showYearSelect && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 z-50 mt-1 w-32 rounded-md border border-zinc-800 bg-zinc-900 py-1 shadow-lg"
                >
                  {Array.from(
                    {
                      length: currentYear - GITHUB_START_CONTRIBUTION_YEAR + 1
                    },
                    (_, i) => currentYear - i
                  )
                    .filter((year) => !IGNORED_CONTRIBUTION_YEARS.includes(year))
                    .map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          setSelectedYear(year);
                          setShowYearSelect(false);
                        }}
                        className={cn(
                          "w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-zinc-800",
                          year === selectedYear ? "text-emerald-500" : "text-zinc-100"
                        )}
                      >
                        {year}
                      </button>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col space-y-4">
          <div className="-mx-4 overflow-x-auto pb-4 md:mx-0">
            <div className="flex min-w-max px-4 py-2 md:px-0">
              {months.map((month, index) => (
                <div key={month} className="flex flex-col" style={{ minWidth: "70px" }}>
                  <div className="mb-2 px-1 text-center text-[10px] font-medium text-zinc-400 md:text-xs">{month}</div>
                  <div className="m-1 grid grid-cols-7 gap-[2px]">
                    {renderMonth(data?.contributions.months[index], index, loading)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <AnimatePresence>
            {data && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-start justify-between space-y-2 rounded-lg bg-zinc-800/50 p-3 md:flex-row md:items-center md:space-y-0 md:p-4"
              >
                <div className="flex items-center space-x-2 text-xs text-zinc-300 md:text-sm">
                  <CalendarDays className="h-4 w-4 text-emerald-400 md:h-5 md:w-5" />
                  <span>
                    <strong>{data.contributions.totalContributions}</strong> contributions in {data.year}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-zinc-300 md:text-sm">
                  <GitPullRequest className="h-4 w-4 text-emerald-400 md:h-5 md:w-5" />
                  <span>
                    <strong>{data.prs}</strong> Pull Requests
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
