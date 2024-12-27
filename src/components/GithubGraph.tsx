"use client";

import { ContributionGraph } from "@/components/contribution-graph";
import { fetchGitHubContributions } from "@/actions/github";
import { Suspense, useCallback, useEffect, useState } from "react";
import { ContributionCalendar } from "@/types/github";

function ContributionGraphLoader() {
  return (
    <div className="flex h-[400px] w-full animate-pulse items-center justify-center rounded-lg bg-muted">
      <p className="text-muted-foreground">Loading GitHub contributions...</p>
    </div>
  );
}

export default function GithubGraph() {
  const [initialData, setInitialData] = useState<ContributionCalendar | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const handleFetchGitHubContributions = useCallback(async () => {
    setLoading(true);
    fetchGitHubContributions()
      .then((data) => {
        setInitialData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    handleFetchGitHubContributions();
  }, [handleFetchGitHubContributions]);

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex h-[300px] w-full items-center justify-center rounded-lg bg-muted">
          <p className="text-muted-foreground">
            Loading GitHub contributions...
          </p>
        </div>
      </div>
    );
  }

  if (initialData === null) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex h-[300px] w-full items-center justify-center rounded-lg bg-muted">
          <p className="text-muted-foreground">
            No GitHub contributions found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <Suspense fallback={<ContributionGraphLoader />}>
        <ContributionGraph initialData={initialData} />
      </Suspense>
    </div>
  );
}
