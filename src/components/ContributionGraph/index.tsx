"use client";

import { CalendarDays, GitPullRequest, Loader2, Users2 } from "lucide-react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentYear, getToday } from "@/lib/config";
import { MONTHS } from "@/lib/constants";
import { getGithubContributionData, getGithubFollowers } from "@/lib/gh";

import { PreFetchUrl } from "../PreFetchUrl";

import { MonthGrid } from "./MonthGrid";
import { YearSelector } from "./YearSelector";

import type { CONTRIBUTION } from "@/types/github";
import type React from "react";

export function ContributionGraph(): React.ReactElement {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<{
    followers: number;
    contributions: Record<number, CONTRIBUTION>;
  }>(() => ({
    followers: 0,
    contributions: {}
  }));
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(getCurrentYear);

  const selectedYearData = useMemo(() => data.contributions[selectedYear], [data.contributions, selectedYear]);
  const [isScrolled, setIsScrolled] = useState(false);

  const fetchYearData = useCallback(
    async (year: number) => {
      if (data.contributions[year]) return;

      try {
        const newData = await getGithubContributionData(year);
        if (newData) {
          setData((prevData) => ({
            ...prevData,
            contributions: {
              ...prevData.contributions,
              [year]: newData
            }
          }));
        }
      } catch (error) {
        console.error("Failed to fetch year data:", error);
      }
    },
    [data.contributions]
  );

  const fetchFollowers = useCallback(async () => {
    if (data.followers) return;

    try {
      const resData = await getGithubFollowers();
      setData((prevData) => ({
        ...prevData,
        followers: resData.status === "success" ? resData.data.length : 0
      }));
    } catch (error) {
      console.error("Failed to fetch followers:", error);
    }
  }, [data.followers]);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchYearData(selectedYear), fetchFollowers()]);
      if (mounted) setLoading(false);
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [selectedYear, fetchYearData, fetchFollowers]);

  const scrollToCurrentMonth = useCallback(() => {
    if (isScrolled || !scrollContainerRef.current || selectedYear !== getToday().getFullYear()) return;
    const currentMonth = getToday().getMonth();
    const monthWidth =
      scrollContainerRef.current?.querySelector(".month-container")?.getBoundingClientRect().width ?? 70;
    const scrollPosition = monthWidth * currentMonth;
    const containerWidth = scrollContainerRef.current.getBoundingClientRect().width;
    const rightAlignedScrollPosition = scrollPosition - containerWidth + monthWidth;
    scrollContainerRef.current.scrollTo({
      left: Math.max(0, rightAlignedScrollPosition),
      behavior: "smooth"
    });
    setIsScrolled(true);
  }, [selectedYear, isScrolled]);

  useEffect(() => {
    scrollToCurrentMonth();
  }, [scrollToCurrentMonth, selectedYear]);

  const renderStats = useMemo(() => {
    if (loading) {
      return (
        <>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-36" />
        </>
      );
    }

    if (!selectedYearData) return null;

    return (
      <>
        <div className="text-muted-foreground flex items-center space-x-2 text-xs md:text-sm">
          <CalendarDays className="h-4 w-4 text-emerald-400 md:h-5 md:w-5" />
          <span>
            <strong>{selectedYearData.contributions.totalContributions}</strong> contributions
          </span>
        </div>
        <PreFetchUrl
          href="/gh-followers"
          className="text-muted-foreground flex items-center space-x-2 text-xs md:text-sm"
        >
          <Users2 className="h-4 w-4 text-emerald-400 md:h-5 md:w-5" />
          <span className="hover:underline">
            <strong>{data.followers}</strong> followers
          </span>
        </PreFetchUrl>
        <PreFetchUrl href="/prs" className="text-muted-foreground flex items-center space-x-2 text-xs md:text-sm">
          <GitPullRequest className="h-4 w-4 text-emerald-400 md:h-5 md:w-5" />
          <span className="hover:underline">
            <strong>{selectedYearData.prs}</strong> Pull Requests
          </span>
        </PreFetchUrl>
      </>
    );
  }, [loading, selectedYearData, data.followers]);

  return (
    <Card className="border-border bg-background w-full max-w-full shadow-xl backdrop-blur-md md:max-w-6xl">
      <CardHeader className="border-border border-b px-4 py-3 md:px-6">
        <CardTitle className="text-foreground flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
          <div className="text-foreground flex items-center gap-2 text-xl font-bold md:text-2xl">
            GitHub Contributions
            <Loader2 className={`text-emerald-400 ${loading ? "block" : "hidden"} md:h-6 md:w-6 md:animate-spin`} />
          </div>
          <YearSelector selectedYear={selectedYear} onYearChange={setSelectedYear} />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col space-y-4">
          <div ref={scrollContainerRef} className="-mx-4 overflow-x-auto pb-4 md:mx-0">
            <div className="flex min-w-max px-4 py-2 md:px-0">
              {MONTHS.map((month, index) => (
                <div key={month} className="month-container flex flex-col" style={{ minWidth: "70px" }}>
                  <div className="mb-2 px-1 text-center text-[10px] font-medium md:text-xs">{month}</div>
                  <MonthGrid
                    year={selectedYear}
                    month={index}
                    contributions={selectedYearData?.contributions.months[index]?.days || []}
                    isLoading={loading}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-muted flex flex-col items-start justify-between space-y-2 rounded-lg p-3 min-[400px]:flex-row min-[400px]:space-y-0 md:items-center md:p-4">
            {renderStats}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
