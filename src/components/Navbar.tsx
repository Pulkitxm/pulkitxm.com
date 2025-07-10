"use client";

import { Menu, PenToolIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { NAVIGATION_LINKS } from "@/data/pages";
import { cn } from "@/lib/utils";

import { PreFetchUrl } from "./PreFetchUrl";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);

  const pathname = usePathname();
  const cleanPathname = useMemo(() => pathname.replace(/\/$/, ""), [pathname]);

  const isLinkActive = useCallback(
    (linkUrl: string) => {
      if (linkUrl === "/") {
        return cleanPathname === "";
      }
      return cleanPathname.startsWith(linkUrl);
    },
    [cleanPathname]
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <nav className="mb-6 w-full" role="navigation" aria-label="Main navigation">
      <div className={`${!isMobile ? "container" : ""} mx-auto px-4`}>
        {isMobile ? <MobileMenu isLinkActive={isLinkActive} /> : <LargeMenu isLinkActive={isLinkActive} />}
      </div>
    </nav>
  );
}

function LargeMenu({ isLinkActive }: { isLinkActive: (linkUrl: string) => boolean }) {
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [underlineStyle, setUnderlineStyle] = useState<{
    width?: string;
    transform?: string;
    opacity?: number;
  }>({});

  const menuRef = useRef<HTMLUListElement>(null);

  const activeIndex = useMemo(() => {
    return NAVIGATION_LINKS.findIndex((link) => isLinkActive(link.url));
  }, [isLinkActive]);

  useEffect(() => {
    if (menuRef.current) {
      const targetIndex = hoveredIndex !== -1 ? hoveredIndex : activeIndex;
      if (targetIndex !== -1) {
        const targetLink = menuRef.current.children[targetIndex] as HTMLElement;
        const menuRect = menuRef.current.getBoundingClientRect();
        const linkRect = targetLink.getBoundingClientRect();

        setUnderlineStyle({
          width: `${linkRect.width}px`,
          transform: `translateX(${linkRect.left - menuRect.left}px)`,
          opacity: 1
        });
      } else {
        setUnderlineStyle({ opacity: 0 });
      }
    }
  }, [activeIndex, hoveredIndex]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, index: number) => {
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      const prevLink = menuRef.current?.children[index - 1]?.querySelector("a") as HTMLElement;
      prevLink?.focus();
    } else if (event.key === "ArrowRight" && index < NAVIGATION_LINKS.length - 1) {
      event.preventDefault();
      const nextLink = menuRef.current?.children[index + 1]?.querySelector("a") as HTMLElement;
      nextLink?.focus();
    }
  }, []);

  return (
    <div className="flex flex-col">
      <ul ref={menuRef} className="flex items-center justify-end space-x-4">
        {NAVIGATION_LINKS.map((link, index) => (
          <li key={index}>
            <PreFetchUrl
              href={link.url}
              className={cn(
                "focus:outline-primary relative flex items-center justify-between rounded px-2 py-1 text-sm transition-colors duration-200 select-none focus:outline-2 focus:outline-offset-2",
                isLinkActive(link.url) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(-1)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-current={isLinkActive(link.url) ? "page" : undefined}
            >
              <span>{link.title}</span>
              <span className="ml-0.5 text-xs">({link.key})</span>
            </PreFetchUrl>
          </li>
        ))}
        <li>
          <PreFetchUrl href="/guestbook" className="flex items-center rounded text-sm">
            <Button variant="default" aria-label="Go to guestbook page">
              Guestbook
              <PenToolIcon className="ml-1 inline h-4 w-4" aria-hidden="true" />
            </Button>
          </PreFetchUrl>
        </li>
        <li>
          <ThemeToggle />
        </li>
      </ul>
      <div className="relative h-0.5 w-full">
        <div className="bg-primary absolute h-full transition-all duration-300 ease-in-out" style={underlineStyle} />
      </div>
    </div>
  );
}

function MobileMenu({ isLinkActive }: { isLinkActive: (linkUrl: string) => boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-background w-[240px] p-0">
        <SheetTitle className="bg-card text-foreground p-4">Menu</SheetTitle>
        <nav className="flex flex-col py-4" role="navigation" aria-label="Mobile navigation">
          {NAVIGATION_LINKS.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              onClick={() => setIsOpen(false)}
              className={cn(
                "focus:outline-primary px-4 py-2 text-sm transition-colors duration-200 focus:outline-2 focus:outline-offset-2",
                isLinkActive(link.url)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              aria-current={isLinkActive(link.url) ? "page" : undefined}
            >
              {link.title}
            </Link>
          ))}
          <Link
            href="/guestbook"
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-primary mt-2 flex items-center px-4 py-2 text-sm transition-colors focus:outline-2 focus:outline-offset-2"
          >
            Sign my Guestbook
            <PenToolIcon className="ml-1 h-4 w-4" aria-hidden="true" />
          </Link>
          <div className="text-muted-foreground hover:bg-muted hover:text-foreground mt-2 flex items-center px-4 text-sm transition-colors">
            <ThemeToggle simple>
              {(theme) => <span className="ml-2">{theme === "dark" ? "Dark" : "Light"} Mode</span>}
            </ThemeToggle>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
