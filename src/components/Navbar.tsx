"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import links from "@/data/pages";
import { FEATURE_FLAGS } from "@/lib/config";
import { cn } from "@/lib/utils";

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
  const router = useRouter();
  const menuRef = useRef<HTMLUListElement>(null);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [underlineStyle, setUnderlineStyle] = useState({});

  const findActiveIndex = useCallback(() => {
    return links.findIndex((link) => isLinkActive(link.url));
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

      const link = links.find((link) => link.key === event.key.toLowerCase());
      if (link) router.push(link.url);
    },
    [router]
  );

  useEffect(() => {
    if (!FEATURE_FLAGS.SHORTCUT_NAVIGATION) return;

    window.addEventListener("keydown", handleKeyboardNavigation);
    return () => window.removeEventListener("keydown", handleKeyboardNavigation);
  }, [handleKeyboardNavigation]);

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
        {links.map((link, index) => (
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
          {links.map((link, index) => (
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
