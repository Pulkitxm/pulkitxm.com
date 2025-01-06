"use client";

import { ArrowUp } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { FEATURE_FLAGS } from "@/lib/config";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);

  const scrolWithKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "t") {
        scrollToTop();
      }
    },
    [scrollToTop]
  );

  const toggleVisibility = useCallback(() => {
    if (window.scrollY > 300) {
      setIsVisible(true);
      window.addEventListener("keydown", scrolWithKey);
    } else {
      setIsVisible(false);
      window.removeEventListener("keydown", scrolWithKey);
    }
  }, [scrolWithKey]);

  useEffect(() => {
    if (!FEATURE_FLAGS.SHORTCUT_NAVIGATION || typeof window === "undefined") return;
    window.addEventListener("scroll", toggleVisibility);
    toggleVisibility();

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [scrolWithKey, toggleVisibility]);

  return (
    <Button
      className={`fixed bottom-4 right-4 z-50 rounded-full p-2 ${
        isVisible ? "" : "pointer-events-none opacity-0"
      } transition-opacity duration-300`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
