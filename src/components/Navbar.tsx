"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import links from "@/data/pages";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    function handleKeyDown(event: KeyboardEvent) {
      if (
        document.activeElement?.tagName.toLowerCase() === "input" ||
        document.activeElement?.tagName.toLowerCase() === "textarea"
      )
        return;

      if (links.some((link) => link.key === event.key.toLowerCase())) {
        const link = links.find(
          (link) => link.key === event.key.toLowerCase(),
        )?.url;
        if (link) router.push(link);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <nav className="w-full bg-black">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:justify-end">
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] bg-black p-0">
              <div className="flex flex-col py-4">
                {links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-4 py-2 text-sm transition-colors duration-200",
                      pathname === link.url
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-gray-200",
                    )}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Menu */}
          <ul className="hidden items-center space-x-4 md:flex">
            {links.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.url}
                  className={cn(
                    "relative text-sm transition-colors duration-200",
                    pathname === link.url
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-200",
                  )}
                >
                  <span>{link.title}</span>
                  <span className="ml-0.5 text-xs text-gray-500">
                    ({link.key})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
