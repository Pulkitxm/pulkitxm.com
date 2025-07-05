"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ThemeOption {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const themeOptions: ThemeOption[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor }
];

export function ThemeSelect() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = async (newTheme: string) => {
    const update = () => {
      setTheme(newTheme);
    };

    // Check if View Transition API is supported and we're actually changing themes
    if (typeof document !== "undefined" && "startViewTransition" in document && newTheme !== resolvedTheme) {
      try {
        document.documentElement.style.viewTransitionName = "theme-transition";
        await document.startViewTransition(update).finished;
        document.documentElement.style.viewTransitionName = "";
      } catch (error) {
        console.error("View transition failed:", error);
        update();
      }
    } else {
      update();
    }
  };

  if (!mounted) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Loading..." />
        </SelectTrigger>
      </Select>
    );
  }

  const currentTheme = themeOptions.find((option) => option.value === theme) || themeOptions[0];
  const CurrentIcon = currentTheme.icon;

  return (
    <Select value={theme} onValueChange={handleThemeChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          <div className="flex items-center gap-2">
            <CurrentIcon className="h-4 w-4" />
            <span>{currentTheme.label}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {themeOptions.map((option) => {
          const Icon = option.icon;
          return (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{option.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export function ThemeToggleWithSystem() {
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
        document.documentElement.style.viewTransitionName = "theme-transition";
        await document.startViewTransition(update).finished;
        document.documentElement.style.viewTransitionName = "";
      } catch (error) {
        console.error("View transition failed:", error);
        update();
      }
    } else {
      update();
    }
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <div className="h-4 w-4 animate-pulse rounded bg-gray-300" />
      </Button>
    );
  }

  const getCurrentIcon = () => {
    if (theme === "system") {
      return resolvedTheme === "dark" ? Moon : Sun;
    }
    return theme === "dark" ? Moon : Sun;
  };

  const CurrentIcon = getCurrentIcon();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleThemeToggle}
      className="h-9 w-9 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <CurrentIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
    </Button>
  );
}
