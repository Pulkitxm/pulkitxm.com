"use client";

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
      <p className={`mt-1 text-sm text-gray-300 ${lastUpdated === null ? "opacity-0" : ""}`}>
        Last updated {lastUpdated ? formatTimeUpdatedAgo(lastUpdated) : ""}
      </p>
    </div>
  );
}
