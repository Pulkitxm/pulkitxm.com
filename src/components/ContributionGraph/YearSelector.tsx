import { ChevronDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

import { getAvailableYears } from "@/lib/config";
import { cn } from "@/lib/utils";

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export const YearSelector: React.FC<YearSelectorProps> = ({ selectedYear, onYearChange }) => {
  const [showYearSelect, setShowYearSelect] = useState(false);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (showYearSelect && !(e.target as HTMLElement).closest(".year-select")) {
        setShowYearSelect(false);
      }
    },
    [showYearSelect]
  );

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div className="year-select relative">
      <button
        onClick={() => setShowYearSelect(!showYearSelect)}
        className="flex items-center space-x-2 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 transition-colors hover:bg-zinc-700"
      >
        <span className="text-sm text-zinc-100">{selectedYear}</span>
        <ChevronDown className="h-4 w-4 text-zinc-300" />
      </button>
      {showYearSelect && (
        <div className="absolute left-0 z-50 mt-1 w-32 rounded-md border border-zinc-800 bg-zinc-900 py-1 shadow-lg md:left-[-25%]">
          {getAvailableYears().map((year) => (
            <button
              key={year}
              onClick={() => {
                onYearChange(year);
                setShowYearSelect(false);
              }}
              className={cn(
                "w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-zinc-800",
                year === selectedYear ? "text-emerald-500" : "text-zinc-100"
              )}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
