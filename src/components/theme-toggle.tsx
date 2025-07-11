"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Fragment, useEffect, useState, useId } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  simple,
  className,
  children,
  dual
}: {
  simple?: boolean;
  className?: string;
  children?: (theme: "light" | "dark") => React.ReactNode;
  dual?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const tabsId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = async (_newTheme?: "light" | "dark") => {
    const newTheme = _newTheme ?? (theme === "dark" ? "light" : "dark");

    const update = () => {
      setTheme(newTheme);
    };

    if (typeof document !== "undefined" && "startViewTransition" in document && newTheme !== resolvedTheme) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 50));

        document.documentElement.style.viewTransitionName = "theme-transition";
        await document.startViewTransition(update).finished;
        document.documentElement.style.viewTransitionName = "";
      } catch (error) {
        console.error("View transition failed:", error);
        update();
      }
    } else {
      setTimeout(() => {
        update();
      }, 50);
    }
  };

  const ButtonCx = simple ? "button" : Button;

  if (!mounted) {
    return (
      <ButtonCx
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        aria-label="Loading theme toggle"
        suppressHydrationWarning
      >
        <div className="h-4 w-4 animate-pulse rounded bg-gray-300" />
      </ButtonCx>
    );
  }

  const WrapperCx = children ? "div" : Fragment;

  return (
    <WrapperCx
      className="flex cursor-pointer items-center gap-2 select-none"
      onClick={children ? () => handleThemeToggle(theme === "dark" ? "light" : "dark") : undefined}
    >
      {children && children(theme === "dark" ? "dark" : "light")}
      {dual ? (
        <div className="w-auto">
          <div
            className="bg-muted border-border flex gap-1 rounded-lg border p-1 shadow-sm"
            role="tablist"
            aria-label="Theme selection"
          >
            <button
              type="button"
              role="tab"
              aria-selected={theme === "light"}
              id={`theme-toggle-light-${tabsId}`}
              className={cn(
                "inline-flex h-8 cursor-pointer items-center gap-1 rounded-md border border-transparent px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                theme === "light"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => handleThemeToggle("light")}
              aria-label="Switch to light theme"
            >
              <Sun className="h-4 w-4" aria-hidden="true" /> Light
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={theme === "dark"}
              id={`theme-toggle-dark-${tabsId}`}
              className={cn(
                "inline-flex h-8 cursor-pointer items-center gap-1 rounded-md border border-transparent px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                theme === "dark"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => handleThemeToggle("dark")}
              aria-label="Switch to dark theme"
            >
              <Moon className="h-4 w-4" aria-hidden="true" /> Dark
            </button>
          </div>
        </div>
      ) : (
        <ButtonCx
          variant="ghost"
          size="icon"
          onClick={children ? undefined : () => handleThemeToggle(theme === "dark" ? "light" : "dark")}
          className={cn(
            "h-9 w-9 cursor-pointer transition-colors",
            simple ? "" : "hover:bg-gray-200 dark:hover:bg-gray-700",
            className
          )}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" aria-hidden="true" />
          ) : (
            <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" aria-hidden="true" />
          )}
        </ButtonCx>
      )}
    </WrapperCx>
  );
}
