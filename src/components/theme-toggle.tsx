"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";

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

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <div className="h-4 w-4 animate-pulse rounded bg-gray-300" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleThemeToggle}
      className="h-9 w-9 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      ) : (
        <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      )}
    </Button>
  );
}
