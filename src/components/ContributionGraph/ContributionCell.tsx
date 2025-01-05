import { motion } from "framer-motion";
import React from "react";

import { cn } from "@/lib/utils";

interface ContributionCellProps {
  date: Date;
  contributionCount: number;
  isLoading: boolean;
  isAnimating: boolean;
  animationDelay: number;
  isToday: boolean;
  isJoinedDate: boolean;
  isHighlighted: boolean;
}

const getContributionColor = (count: number) => {
  if (count === 0) return "bg-zinc-800 dark:bg-zinc-750";
  if (count < 5) return "bg-emerald-700 dark:bg-emerald-600";
  if (count < 10) return "bg-emerald-500 dark:bg-emerald-400";
  if (count < 20) return "bg-emerald-400 dark:bg-emerald-300";
  return "bg-emerald-300 dark:bg-emerald-200";
};

export const ContributionCell: React.FC<ContributionCellProps> = React.memo(
  ({ date, contributionCount, isLoading, isAnimating, animationDelay, isToday, isJoinedDate, isHighlighted }) => {
    return (
      <motion.div
        initial={false}
        animate={
          isLoading
            ? { opacity: [0.3, 0.6, 0.3] }
            : isAnimating
              ? {
                  opacity: [0.3, 1, 0.7],
                  scale: [0.8, 1, 0.9]
                }
              : isHighlighted
                ? { scale: [1, 1.2, 1], transition: { duration: 0.5 } }
                : { opacity: 1, scale: 1 }
        }
        transition={{
          duration: isLoading ? 1.5 : 0.5,
          delay: isAnimating ? animationDelay : 0,
          repeat: isLoading ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        <div
          className={cn(
            "m-[1px] h-[10px] w-[10px] rounded-[2px] transition-all duration-200 ease-in-out hover:scale-125 md:h-4 md:w-4",
            isLoading
              ? "bg-zinc-800/50"
              : isToday
                ? "bg-red-600"
                : isJoinedDate
                  ? "bg-amber-300"
                  : getContributionColor(contributionCount)
          )}
          title={
            isJoinedDate
              ? "The day I joined GitHub"
              : isToday
                ? "Let me contribute today :)"
                : isLoading
                  ? "Loading..."
                  : `${contributionCount} contribution${contributionCount !== 1 ? "s" : ""} on ${date.toDateString()}`
          }
        />
      </motion.div>
    );
  }
);

ContributionCell.displayName = "ContributionCell";
