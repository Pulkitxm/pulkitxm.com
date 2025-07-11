"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Fragment, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <ButtonCx variant="ghost" size="icon" className="h-9 w-9" aria-label="Loading theme toggle">
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
        <Tabs value={theme === "dark" ? "dark" : "light"} className="w-auto" aria-label="Theme selection">
          <TabsList className="bg-muted flex gap-1 rounded-lg p-1">
            <TabsTrigger
              value="light"
              className="h-8 cursor-pointer items-center gap-1 px-3 py-1.5 text-xs"
              onClick={() => handleThemeToggle("light")}
            >
              <Sun className="h-4 w-4" aria-hidden="true" /> Light
            </TabsTrigger>
            <TabsTrigger
              value="dark"
              className="h-8 cursor-pointer items-center gap-1 px-3 py-1.5 text-xs"
              onClick={() => handleThemeToggle("dark")}
            >
              <Moon className="h-4 w-4" aria-hidden="true" /> Dark
            </TabsTrigger>
          </TabsList>
        </Tabs>
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
