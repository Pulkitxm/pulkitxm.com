import { motion } from "framer-motion";
import { ArrowDownUp, RefreshCw } from "lucide-react";
import { FC } from "react";

import { cn } from "@/lib/utils";
import { Suggestion } from "@/types/chat";

type SuggestionsBarProps = {
  suggestions: Suggestion[];
  loadingSuggestions: boolean;
  sortAlphabetically: boolean;
  onSuggestionClick: (suggestion: string) => void;
  onToggleSort: () => void;
  onRefresh: () => void;
};

const buttonHoverAnimation = { scale: 1.05 };
const buttonTapAnimation = { scale: 0.95 };

export const SuggestionsBar: FC<SuggestionsBarProps> = ({
  suggestions,
  loadingSuggestions,
  sortAlphabetically,
  onSuggestionClick,
  onToggleSort,
  onRefresh
}) => {
  return (
    <div className="mb-2 flex items-center justify-between">
      <div className="flex max-w-[85%] flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="rounded-full bg-green-700 px-3 py-1 text-xs text-green-300 transition-colors hover:bg-green-600 focus:outline-none"
            aria-label={`Use suggestion: ${suggestion}`}
          >
            {suggestion}
          </button>
        ))}
      </div>
      <div className="flex gap-1">
        <motion.button
          whileHover={buttonHoverAnimation}
          whileTap={buttonTapAnimation}
          onClick={onToggleSort}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-green-700 text-green-300 transition-colors hover:bg-green-600"
          title={sortAlphabetically ? "Sort by relevance" : "Sort alphabetically"}
          aria-label={sortAlphabetically ? "Sort by relevance" : "Sort alphabetically"}
        >
          <ArrowDownUp size={14} aria-hidden="true" />
        </motion.button>
        <motion.button
          whileHover={buttonHoverAnimation}
          whileTap={buttonTapAnimation}
          onClick={onRefresh}
          disabled={loadingSuggestions}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full transition-all",
            loadingSuggestions ? "bg-gray-600 text-gray-400" : "bg-green-700 text-green-300 hover:bg-green-600"
          )}
          title="Generate new suggestions"
          aria-label="Generate new suggestions"
        >
          <RefreshCw size={14} className={cn(loadingSuggestions && "animate-spin")} aria-hidden="true" />
        </motion.button>
      </div>
    </div>
  );
};
