import React from "react";

import { cn } from "@/lib/utils";

interface ContributionCellProps {
  date: Date;
  contributionCount: number;
  isLoading: boolean;
  isToday: boolean;
  isJoinedDate: boolean;
}

const getContributionColor = (count: number) => {
  let level = 0;

  if (count === 0) {
    level = 0;
  } else if (count <= 3) {
    level = 1;
  } else if (count <= 6) {
    level = 2;
  } else if (count <= 9) {
    level = 3;
  } else {
    level = 4;
  }

  switch (level) {
    case 0:
      return "bg-gray-100 dark:bg-gray-800";
    case 1:
      return "bg-green-100 dark:bg-green-900";
    case 2:
      return "bg-green-300 dark:bg-green-700";
    case 3:
      return "bg-green-500 dark:bg-green-500";
    case 4:
      return "bg-green-700 dark:bg-green-300";
    default:
      return "bg-gray-100 dark:bg-gray-800";
  }
};

export const ContributionCell: React.FC<ContributionCellProps> = React.memo(
  ({ date, contributionCount, isLoading, isToday, isJoinedDate }) => {
    const cellClass = cn(
      "m-px h-[10px] w-[10px] rounded-[2px] border transition-all duration-200 ease-in-out hover:scale-125 md:h-4 md:w-4",
      isLoading
        ? "bg-muted"
        : isToday
          ? "bg-accent border border-accent-foreground"
          : isJoinedDate
            ? "bg-yellow-300 dark:bg-yellow-400"
            : getContributionColor(contributionCount)
    );

    const title = isJoinedDate
      ? "The day I joined GitHub"
      : isToday
        ? "Let me contribute today :)"
        : isLoading
          ? "Loading..."
          : `${contributionCount} contribution${contributionCount !== 1 ? "s" : ""} on ${date.toLocaleDateString(
              "default",
              {
                day: "numeric",
                month: "short"
              }
            )}`;

    return <div className={cellClass} title={title} />;
  }
);

ContributionCell.displayName = "ContributionCell";
