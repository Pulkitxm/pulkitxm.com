"use client";

import { Menu, PenToolIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { NAVIGATION_LINKS } from "@/data/pages";
import { cn } from "@/lib/utils";

import ActiveUsers from "./ActiveUsers";
import { PreFetchUrl } from "./PreFetchUrl";

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
    <nav className="mb-6 w-full bg-black">
      <div className={`${!isMobile ? "container" : ""} mx-auto px-4`}>
        {isMobile ? <MobileMenu isLinkActive={isLinkActive} /> : <LargeMenu isLinkActive={isLinkActive} />}
      </div>
    </nav>
  );
}

function LargeMenu({ isLinkActive }: { isLinkActive: (linkUrl: string) => boolean }) {
  const useNavigation = useFeatureFlagEnabled("shortcut-navigation");
  const router = useRouter();
  const menuRef = useRef<HTMLUListElement>(null);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [underlineStyle, setUnderlineStyle] = useState({});

  const findActiveIndex = useCallback(() => {
    return NAVIGATION_LINKS.findIndex((link) => isLinkActive(link.url));
  }, [isLinkActive]);

  useEffect(() => {
    setActiveIndex(findActiveIndex());
  }, [findActiveIndex]);

  const handleKeyboardNavigation = useCallback(
    (event: KeyboardEvent) => {
      if (
        document.activeElement?.tagName.toLowerCase() === "input" ||
        document.activeElement?.tagName.toLowerCase() === "textarea" ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        event.shiftKey
      )
        return;

      const link = NAVIGATION_LINKS.find((link) => link.key === event.key.toLowerCase());
      if (link) router.push(link.url);
    },
    [router]
  );

  useEffect(() => {
    if (!useNavigation) return;

    window.addEventListener("keydown", handleKeyboardNavigation);
    return () => window.removeEventListener("keydown", handleKeyboardNavigation);
  }, [handleKeyboardNavigation, useNavigation]);

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

  return (
    <div className="flex flex-col">
      <ul ref={menuRef} className="flex items-center justify-end space-x-4">
        {NAVIGATION_LINKS.map((link, index) => (
          <li key={index}>
            <PreFetchUrl
              href={link.url}
              className={cn(
                "relative flex items-center justify-between px-2 py-1 text-sm transition-colors duration-200",
                isLinkActive(link.url) ? "text-white" : "text-[#c6c6c6] hover:text-gray-200"
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(-1)}
            >
              <span>{link.title}</span>
              <span className="ml-0.5 text-xs">({link.key})</span>
            </PreFetchUrl>
          </li>
        ))}
        <li>
          <PreFetchUrl
            href="/guestbook"
            className="flex items-center rounded bg-white px-3 py-1 text-sm text-black transition-colors hover:bg-gray-200"
          >
            Guestbook
            <PenToolIcon className="ml-1 inline h-4 w-4" />
          </PreFetchUrl>
        </li>
        <li className="flex cursor-text items-center space-x-1 select-none" title="Active Visitors">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-400 transition-all duration-[10ms] ease-in-out" />
          <ActiveUsers />
          <UserIcon className="ml-1 h-4 w-4" />
        </li>
      </ul>
      <div className="relative h-0.5 w-full">
        <div className="absolute h-full bg-white transition-all duration-300 ease-in-out" style={underlineStyle} />
      </div>
    </div>
  );
}

function MobileMenu({ isLinkActive }: { isLinkActive: (linkUrl: string) => boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] bg-black p-0">
        <SheetTitle className="bg-gray-900 p-4 text-white">Menu</SheetTitle>
        <div className="flex flex-col py-4">
          {NAVIGATION_LINKS.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              onClick={() => setIsOpen(false)}
              className={cn(
                "px-4 py-2 text-sm transition-colors duration-200",
                isLinkActive(link.url)
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              )}
            >
              {link.title}
            </Link>
          ))}
          <Link
            href="/guestbook"
            onClick={() => setIsOpen(false)}
            className="mt-2 flex items-center px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800"
          >
            Sign my Guestbook
            <PenToolIcon className="ml-1 h-4 w-4" />
          </Link>
          <div className="flex cursor-text items-center space-x-1 px-4 py-2 text-gray-400 select-none">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400 transition-all duration-[10ms] ease-in-out" />
            <ActiveUsers />
            <span className="ml-1">Active Visitors</span>
            <UserIcon className="ml-1 h-4 w-4" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
