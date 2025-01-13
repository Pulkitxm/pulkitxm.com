import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function formatTimeUpdatedAgo(dateString: Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const units = [
    { label: "second", value: 1000 },
    { label: "minute", value: 1000 * 60 },
    { label: "hour", value: 1000 * 60 * 60 },
    { label: "day", value: 1000 * 60 * 60 * 24 },
    { label: "month", value: 1000 * 60 * 60 * 24 * 30 }
  ];

  let i = 0;
  while (i < units.length && diff >= units[i].value) {
    i++;
  }

  const value = Math.floor(diff / units[i - 1].value);
  const label = units[i - 1].label;

  return `${value} ${label}${value > 1 ? "s" : ""} ago`;
}
