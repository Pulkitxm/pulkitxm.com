"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, useRef, useEffect } from "react";

import { cn } from "@/lib/utils";

interface PreFetchUrlProps {
  href: string;
  rel?: string;
  target?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  onMouseEnter?: () => void;
  onTouchStart?: () => void;
  onMouseLeave?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLAnchorElement>) => void;
  role?: string;
}

export function PreFetchUrl({
  href,
  rel,
  target,
  children,
  onClick,
  className,
  onMouseEnter,
  onTouchStart,
  onMouseLeave,
  onKeyDown,
  role
}: PreFetchUrlProps) {
  const router = useRouter();
  const [isPrefetched, setIsPrefetched] = useState(false);
  const [isTouchable, setIsTouchable] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePrefetch = useCallback(() => {
    if (!isPrefetched && !isTouchable) {
      router.prefetch(href);
      setIsPrefetched(true);
    }
  }, [router, href, isPrefetched, isTouchable]);

  const handleMouseEnter = useCallback(() => {
    if (onMouseEnter) onMouseEnter();

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      handlePrefetch();
    }, 100);
  }, [onMouseEnter, handlePrefetch]);

  const handleMouseLeave = useCallback(() => {
    if (onMouseLeave) onMouseLeave();

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  }, [onMouseLeave]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouchable("ontouchstart" in window);
    }
  }, [handlePrefetch]);

  return (
    <Link
      href={href}
      rel={rel}
      target={target}
      className={cn(className, "outline-none select-none")}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onTouchStart={onTouchStart}
      onMouseLeave={handleMouseLeave}
      onKeyDown={onKeyDown}
      role={role}
    >
      {children}
    </Link>
  );
}
