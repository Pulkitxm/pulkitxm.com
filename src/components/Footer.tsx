import { getLatestWorkflow } from "@/actions/gh";
import { formatTimeUpdatedAgo } from "@/lib/utils";

export default async function Footer() {
  const res = await getLatestWorkflow();

  let lastUpdated = new Date();

  if (res.status === "success") {
    lastUpdated = res.data.timeStamp;
  }

  return (
    <div className="mt-8 border-t border-gray-500 py-3 text-center opacity-70">
      <p>Made with ❤️ by Pulkit</p>
      <p className={`mt-1 text-sm text-gray-300 ${lastUpdated === null ? "opacity-0" : ""}`}>
        Last updated {formatTimeUpdatedAgo(lastUpdated)}
      </p>
    </div>
  );
}

export const dynamic = "force-dynamic";
