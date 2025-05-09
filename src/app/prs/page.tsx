"use client";

import axios from "axios";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getToday, GITHUB_START_CONTRIBUTION_YEAR, IGNORED_CONTRIBUTION_YEARS } from "@/lib/config";
import { PR, PR_STATE, PR_STATE_TYPE, PRS_SCHEMA } from "@/types/github";

import { PrListItem } from "./pr-list-item";
import { SkeletonItem, SkeletonFilter } from "./skeleton-item";

const currentYear = getToday().getFullYear();
const PR_STATES: string[] = PR_STATE.options;

export default function PrsPage() {
  const [prs, setPrs] = useState<PR[]>([]);
  const [filteredPrs, setFilteredPrs] = useState<PR[]>([]);
  const [year, setYear] = useState<number | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isReloading, setIsReloading] = useState(false);
  const [prState, setPrState] = useState<PR_STATE_TYPE | "all">("merged");

  const availableYears = useMemo(() => {
    return Array.from({ length: currentYear - GITHUB_START_CONTRIBUTION_YEAR + 1 }, (_, i) => currentYear - i).filter(
      (year) => !IGNORED_CONTRIBUTION_YEARS.includes(year)
    );
  }, []);

  const fetchPRs = useCallback(async () => {
    setIsLoading(true);
    setIsReloading(true);
    try {
      const res = await axios.get(`/api/gh/prs?select=all${year === "all" ? "" : `&y=${year}`}`);
      const parsedData = PRS_SCHEMA.safeParse(res.data);

      if (parsedData.success) {
        setPrs(parsedData.data);
        setFilteredPrs(parsedData.data);
      }
    } catch (error) {
      console.error("Error fetching PRs data:", error);
    } finally {
      setIsLoading(false);
      setIsReloading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchPRs();
  }, [fetchPRs, year]);

  useEffect(() => {
    const filtered = prs.filter((pr) => {
      const matchesName = pr.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchedLabels = pr.labels.map((label) => label.toLowerCase());
      const selectedState = prState === "all" ? true : pr.state === prState;
      return matchesName && matchedLabels && selectedState;
    });
    setFilteredPrs(filtered);
  }, [prState, prs, searchTerm]);

  return (
    <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">My Pull Requests</h1>
      {isLoading ? (
        <SkeletonFilter />
      ) : (
        <div className="mb-6 flex flex-col gap-4 transition-all duration-300 ease-in-out sm:flex-row">
          <div className="relative grow">
            <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search PRs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus:ring-primary pl-10 transition-all duration-200 ease-in-out focus:ring-2"
            />
          </div>
          <div className="flex flex-wrap gap-2 sm:flex-nowrap">
            <Select value={prState} onValueChange={(e) => setPrState(e as PR_STATE_TYPE)}>
              <SelectTrigger className="focus:ring-primary w-full transition-all duration-200 ease-in-out focus:ring-2 sm:w-[150px]">
                <FaFilter className="mr-2" />
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="all">
                  {PR_STATES.map((state, index) => (index === 0 ? state : " & " + state))}
                </SelectItem>
                {PR_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(year)} onValueChange={(e) => setYear(e === "all" ? "all" : Number(e))}>
              <SelectTrigger className="focus:ring-primary w-full transition-all duration-200 ease-in-out focus:ring-2 sm:w-[150px]">
                <FaFilter className="mr-2" />
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="all">All years</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={fetchPRs}
              className="w-full transition-all duration-200 ease-in-out sm:w-auto"
              disabled={isReloading}
            >
              {isReloading ? <Loader2 className="mr-2 animate-spin" /> : <MdRefresh className="mr-2" />}
              {isReloading ? "Reloading..." : "Reload"}
            </Button>
          </div>
        </div>
      )}
      <p className="mb-4 text-sm text-gray-500 transition-all duration-300 ease-in-out">
        Showing {filteredPrs.length} of {prs.length} PRs
      </p>
      <div className="space-y-2 transition-all duration-300 ease-in-out">
        {isLoading ? (
          [...Array(5)].map((_, index) => <SkeletonItem key={index} />)
        ) : filteredPrs.length === 0 ? (
          <p className="text-center text-gray-500">No PRs found</p>
        ) : (
          filteredPrs.map((pr) => <PrListItem key={pr.url} pr={pr} />)
        )}
      </div>
    </main>
  );
}
