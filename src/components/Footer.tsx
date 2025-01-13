"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import { RES_TYPE } from "@/types/globals";

export default function Footer() {
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<RES_TYPE<string>>("/api/gh/last-updated")
      .then((resp) => {
        const res = resp.data;
        if (res.status === "error") {
          setLastUpdated(null);
        } else {
          setLastUpdated(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="mt-8 border-t border-gray-500 py-3 text-center opacity-70">
      <p>Made with ❤️ by Pulkit</p>
      <p className={`mt-1 text-sm text-gray-300 ${lastUpdated === null ? "opacity-0" : ""}`}>
        Last updated {lastUpdated}
      </p>
    </div>
  );
}
