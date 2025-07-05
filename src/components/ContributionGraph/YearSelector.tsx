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
        className="border-border bg-background hover:bg-muted flex items-center space-x-2 rounded-md border px-3 py-1.5 transition-colors"
      >
        <span className="text-foreground text-sm">{selectedYear}</span>
        <ChevronDown className="text-muted-foreground h-4 w-4" />
      </button>
      {showYearSelect && (
        <div className="border-border bg-popover absolute left-0 z-50 mt-1 w-32 rounded-md border py-1 shadow-lg md:left-[-25%]">
          {getAvailableYears().map((year) => (
            <button
              key={year}
              onClick={() => {
                onYearChange(year);
                setShowYearSelect(false);
              }}
              className={cn(
                "hover:bg-muted w-full px-3 py-1.5 text-left text-sm transition-colors",
                year === selectedYear ? "text-primary font-semibold" : "text-foreground"
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
