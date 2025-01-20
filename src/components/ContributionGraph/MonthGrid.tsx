import React, { useMemo } from "react";

import { GITHUB_JOINED_DATE } from "@/lib/config";

import { ContributionCell } from "./ContributionCell";

interface MonthGridProps {
  year: number;
  month: number;
  contributions: { date: Date; contributionCount: number }[];
  isLoading: boolean;
}

export const MonthGrid: React.FC<MonthGridProps> = React.memo(({ year, month, contributions, isLoading }) => {
  const cells = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cellArray: React.ReactNode[] = [];
    const today = new Date();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const contributionDay = contributions.find((d) => d.date.toDateString() === date.toDateString());
      const contributionCount = contributionDay ? contributionDay.contributionCount : 0;
      const isToday = date.toDateString() === today.toDateString();
      const isJoinedDate = date.toDateString() === GITHUB_JOINED_DATE.toDateString();

      cellArray.push(
        <ContributionCell
          key={date.toISOString()}
          date={date}
          contributionCount={contributionCount}
          isLoading={isLoading}
          isToday={isToday}
          isJoinedDate={isJoinedDate}
        />
      );
    }

    return cellArray;
  }, [year, month, contributions, isLoading]);

  return <div className="m-1 grid grid-cols-7 gap-[2px]">{cells}</div>;
});

MonthGrid.displayName = "MonthGrid";
