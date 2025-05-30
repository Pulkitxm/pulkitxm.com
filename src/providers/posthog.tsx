"use client";

import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { usePostHog } from "posthog-js/react";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, Suspense, useState } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [shouldTrack, setShouldTrack] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("posthog") !== "false" || process.env.NODE_ENV === "development") {
      setShouldTrack(true);
    }

    if (localStorage.getItem("posthog") !== "false") {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: false
      });
    }
  }, []);

  if (shouldTrack) {
    return (
      <PHProvider client={posthog}>
        <SuspendedPostHogPageView />
        {children}
      </PHProvider>
    );
  }

  return children;
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + "?" + searchParams.toString();
      }

      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}
