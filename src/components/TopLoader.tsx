"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";

type LoadingState = "idle" | "loading" | "complete";

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState<LoadingState>("idle");
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const observer = useRef<PerformanceObserver | null>(null);
  const resourceCount = useRef<number>(0);
  const initialLoadDone = useRef<boolean>(false);

  const updateProgress = useCallback((targetProgress: number) => {
    setProgress((currentProgress) => {
      if (currentProgress >= targetProgress) return currentProgress;
      return currentProgress + Math.min(1, (targetProgress - currentProgress) / 10);
    });
  }, []);

  const startProgressSimulation = useCallback(() => {
    if (progressInterval.current) clearInterval(progressInterval.current);

    // Start with a small initial progress
    setProgress(5);

    progressInterval.current = setInterval(() => {
      setProgress((currentProgress) => {
        // Slow down as we approach higher percentages
        if (currentProgress < 30) return currentProgress + 1;
        if (currentProgress < 60) return currentProgress + 0.5;
        if (currentProgress < 80) return currentProgress + 0.2;
        if (currentProgress < 90) return currentProgress + 0.1;
        return currentProgress;
      });
    }, 100);
  }, []);

  const trackPageResources = useCallback(() => {
    if (observer.current) observer.current.disconnect();
    resourceCount.current = 0;

    observer.current = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();

      entries.forEach((entry) => {
        if (entry.entryType === "resource") {
          resourceCount.current += 1;

          const progressIncrement = Math.min(
            95,
            resourceCount.current > 3 ? 80 + resourceCount.current / 2 : 20 * resourceCount.current
          );

          updateProgress(progressIncrement);
        }
      });
    });

    observer.current.observe({ entryTypes: ["resource"] });
  }, [updateProgress]);

  const startLoading = useCallback(() => {
    setState("loading");
    setProgress(0);
    startProgressSimulation();
    trackPageResources();
  }, [startProgressSimulation, trackPageResources]);

  const completeLoading = useCallback(() => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    if (observer.current) observer.current.disconnect();

    // Ensure we reach 100%
    setProgress(100);
    setState("complete");

    // Reset after animation completes
    setTimeout(() => {
      setState("idle");
      setProgress(0);
    }, 400);
  }, []);

  useEffect(() => {
    // Skip the initial load
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      return;
    }

    startLoading();

    // Fallback to complete if no resources detected within reasonable time
    const timeoutId = setTimeout(() => {
      completeLoading();
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (observer.current) observer.current.disconnect();
    };
  }, [pathname, searchParams, startLoading, completeLoading]);

  if (state === "idle") return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-1">
      <div className="h-full bg-blue-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
    </div>
  );
}
