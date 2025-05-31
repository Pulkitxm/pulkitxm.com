"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getLatestWorkflow } from "@/actions/gh";
import { formatTimeUpdatedAgo } from "@/lib/utils";

export default function Footer() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    getLatestWorkflow().then((res) => {
      if (res.status === "error") {
        setLastUpdated(null);
      } else {
        setLastUpdated(res.data.timeStamp);
      }
    });
  }, []);

  return (
    <div className="mt-8 border-t border-gray-500 py-3 text-center opacity-70">
      <p>Made with ❤️ by Pulkit</p>
      <div className="flex items-center justify-center space-x-0.5">
        <p className="mt-1 text-sm text-gray-300">© {new Date().getFullYear()} Pulkit. All rights reserved</p>
        <p>|</p>
        <p className="mt-1 text-sm text-gray-300">
          <Link href="/sitemap.xml" className="hover:underline">
            Sitemap
          </Link>
        </p>
      </div>
      <p className={`mt-1 text-sm text-gray-500 ${lastUpdated === null ? "opacity-0" : ""}`}>
        Last updated {lastUpdated ? formatTimeUpdatedAgo(lastUpdated) : ""}
      </p>
    </div>
  );
}
