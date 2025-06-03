"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getLatestWorkflow } from "@/actions/gh";
import { getCachedData, setCachedData } from "@/lib/gh";
import { formatTimeUpdatedAgo } from "@/lib/utils";

interface WorkflowData {
  timeStamp: Date;
}

export default function Footer() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchWorkflowData = async () => {
      const cacheKey = "github-workflow-last-updated";

      const cached = await getCachedData<WorkflowData>(cacheKey);
      if (cached) {
        setLastUpdated(cached.timeStamp);
        return;
      }

      const res = await getLatestWorkflow();
      if (res.status === "error") {
        setLastUpdated(null);
      } else {
        setLastUpdated(res.data.timeStamp);
        setCachedData(cacheKey, res.data);
      }
    };

    fetchWorkflowData();
  }, []);

  return (
    <footer className="mt-12 border-t border-gray-800 pt-8 text-center">
      <div className="mx-auto max-w-4xl px-4">
        <p className="text-lg font-medium text-gray-200">
          Made with <span className="text-red-500">❤️</span> by Pulkit
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Pulkit. All rights reserved</p>
          <div className="flex items-center gap-4">
            <Link href="/sitemap.xml" className="transition-colors hover:text-gray-200 hover:underline">
              Sitemap
            </Link>
            <Link href="/feed.xml" className="transition-colors hover:text-gray-200 hover:underline">
              RSS Feed
            </Link>
          </div>
        </div>
        <p
          className={`mt-4 text-sm text-gray-500 transition-opacity duration-300 ${
            lastUpdated === null ? "opacity-0" : "opacity-70"
          }`}
        >
          Last updated {lastUpdated ? formatTimeUpdatedAgo(lastUpdated) : ""}
        </p>
      </div>
    </footer>
  );
}
