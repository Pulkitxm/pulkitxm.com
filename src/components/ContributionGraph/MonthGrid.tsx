import { motion } from "framer-motion";
import React, { useMemo } from "react";

import { GITHUB_JOINED_DATE } from "@/lib/config";

import { ContributionCell } from "./ContributionCell";

interface MonthGridProps {
  year: number;
  month: number;
  contributions: { date: Date; contributionCount: number }[];
  isLoading: boolean;
  isAnimating: boolean;
  highlightedDate: Date | null;
}

export const MonthGrid: React.FC<MonthGridProps> = React.memo(
  ({ year, month, contributions, isLoading, isAnimating, highlightedDate }) => {
    const cells = useMemo(() => {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const cellArray: React.ReactNode[] = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const contributionDay = contributions.find((d) => d.date.toDateString() === date.toDateString());
        const contributionCount = contributionDay ? contributionDay.contributionCount : 0;
        const isToday = date.toDateString() === new Date().toDateString();
        const isJoinedDate = date.toDateString() === GITHUB_JOINED_DATE.toDateString();
        const isHighlighted = highlightedDate?.toDateString() === date.toDateString();

        cellArray.push(
          <ContributionCell
            key={date.toISOString()}
            date={date}
            contributionCount={contributionCount}
            isLoading={isLoading}
            isAnimating={isAnimating}
            animationDelay={day * 0.01 + month * 0.1}
            isToday={isToday}
            isJoinedDate={isJoinedDate}
            isHighlighted={isHighlighted}
          />
        );
      }

      const remainingCells = 42 - daysInMonth;
      for (let i = 0; i < remainingCells; i++) {
        cellArray.push(<div key={`empty-end-${i}`} className="h-[10px] w-[10px] md:h-3 md:w-3" />);
      }

      return cellArray;
    }, [year, month, contributions, isLoading, isAnimating, highlightedDate]);

    return (
      <motion.div
        initial={false}
        animate={isLoading ? { opacity: 0.7 } : { opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="m-1 grid grid-cols-7 gap-[2px]"
      >
        {cells}
      </motion.div>
    );
  }
);

MonthGrid.displayName = "MonthGrid";
