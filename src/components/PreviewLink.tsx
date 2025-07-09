"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ExternalLink, Calendar, Building, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, forwardRef, useRef, useMemo, memo } from "react";

import profile from "@/data/profile";
import { NEXT_PUBLIC_API_URL } from "@/lib/constants";
import { getCachedData, setCachedData } from "@/lib/gh";
import { cn, getOgImageFromUrl, formatDate } from "@/lib/utils";

import type { OgData } from "@/types/og";

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={cn(
      "overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900",
      className
    )}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("p-4 pb-2", className)}>{children}</div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("p-4 pt-0", className)}>{children}</div>
);

const Badge = ({
  children,
  variant = "default",
  className = ""
}: {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary";
  className?: string;
}) => {
  const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors";
  const variants = {
    default: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    outline: "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-transparent",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  };

  return <span className={cn(baseClasses, variants[variant], className)}>{children}</span>;
};

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={cn("animate-pulse rounded bg-gray-200 dark:bg-gray-700", className)} />
);

function truncateUrl(url: string, maxLength = 50): string {
  if (url.length <= maxLength) return url;
  const start = url.slice(0, maxLength / 2);
  const end = url.slice(-maxLength / 2);
  return `${start}...${end}`;
}

function isSameDomain(url: string): boolean {
  try {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return true;
    }
    const urlObj = new URL(url);
    const currentDomain = typeof window !== "undefined" ? window.location.hostname : "localhost";
    return urlObj.hostname === currentDomain;
  } catch {
    return true;
  }
}

function getOptimalPosition(element: HTMLElement): {
  vertical: "top" | "bottom";
  horizontal: "left" | "center" | "right";
} {
  const rect = element.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const cardWidth = 320;
  const cardHeight = 250;

  const spaceBelow = viewportHeight - rect.bottom;
  const spaceAbove = rect.top;
  const showAbove = spaceBelow < cardHeight + 20 && spaceAbove > cardHeight + 20;

  const elementCenter = rect.left + rect.width / 2;
  const spaceRight = viewportWidth - elementCenter;
  const spaceLeft = elementCenter;

  let horizontalAlign: "left" | "center" | "right" = "center";

  if (spaceRight < cardWidth / 2 + 20) {
    horizontalAlign = "right";
  } else if (spaceLeft < cardWidth / 2 + 20) {
    horizontalAlign = "left";
  }

  return {
    vertical: showAbove ? "top" : "bottom",
    horizontal: horizontalAlign
  };
}

function throttle<T extends (...args: never[]) => unknown>(func: T, limit: number): T {
  let inThrottle: boolean;
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}

interface PreviewLinkProps {
  href: string;
  children?: React.ReactNode;
  className?: string;
  preFetch?: boolean;
}

function PreviewSkeleton() {
  return (
    <Card className="w-80 shadow-xl">
      <CardHeader>
        <div className="mb-2 flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 flex-1" />
        </div>
        <Skeleton className="h-3 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-3 h-32 w-full rounded-lg" />
        <Skeleton className="mb-2 h-3 w-full" />
        <Skeleton className="mb-3 h-3 w-2/3" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </CardContent>
    </Card>
  );
}

const ExternalPreview = memo(({ url }: { url: string }) => {
  const [state, setState] = useState<{
    ogData: OgData | null;
    isLoading: boolean;
    error: boolean;
  }>({
    ogData: null,
    isLoading: true,
    error: false
  });

  useEffect(() => {
    const fetchOgData = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: false }));

        const cacheKey = `og-data-${btoa(url).replace(/[^a-zA-Z0-9]/g, "")}`;

        const cachedData = await getCachedData<OgData>(cacheKey);
        if (cachedData) {
          setState({ ogData: cachedData, isLoading: false, error: false });
          return;
        }

        const params = new URLSearchParams({ url });
        const response = await fetch(`/api/og?${params}`);
        const data = await response.json();

        if (data.success && data.data) {
          const ogDataResult: OgData = {
            title: data.data.title,
            description: data.data.description,
            image: data.data.image,
            url: data.data.url,
            siteName: data.data.siteName,
            favicon: data.data.favicon
          };

          setState({ ogData: ogDataResult, isLoading: false, error: false });
          setCachedData(cacheKey, ogDataResult);
        } else {
          setState((prev) => ({ ...prev, error: true, isLoading: false }));
        }
      } catch (err) {
        console.error("Error fetching OG data:", err);
        setState((prev) => ({ ...prev, error: true, isLoading: false }));
      }
    };

    fetchOgData();
  }, [url]);

  const { ogData, isLoading, error } = state;

  if (isLoading) {
    return <PreviewSkeleton />;
  }

  if (error || !ogData) {
    return (
      <Card className="w-80 shadow-xl">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm font-medium">{truncateUrl(url)}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80 shadow-xl">
      <CardHeader>
        <div className="mb-1 flex items-center gap-2">
          {ogData.favicon && <img src={ogData.favicon || "/placeholder.svg"} alt="" className="h-4 w-4 rounded" />}
          <h3 className="line-clamp-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
            {ogData.title || "Untitled"}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <ExternalLink className="h-3 w-3" />
          {truncateUrl(ogData.url || url)}
        </div>
      </CardHeader>
      <CardContent>
        {ogData.image && (
          <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <img
              src={ogData.image || "/placeholder.svg"}
              alt={ogData.title || "Preview"}
              className="h-full w-full object-cover transition-transform"
            />
          </div>
        )}
        {ogData.description && (
          <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{ogData.description}</p>
        )}
      </CardContent>
    </Card>
  );
});

ExternalPreview.displayName = "ExternalPreview";

const InternalPreview = memo(({ url }: { url: string }) => {
  const ogImage = useMemo(() => getOgImageFromUrl(url), [url]);

  const path = useMemo(() => {
    try {
      if (url.startsWith("/")) {
        return url;
      } else if (url.startsWith("http://") || url.startsWith("https://")) {
        const urlObj = new URL(url);
        return urlObj.pathname;
      } else {
        return url.startsWith("/") ? url : `/${url}`;
      }
    } catch {
      return url.startsWith("/") ? url : `/${url}`;
    }
  }, [url]);

  const experience = useMemo(() => {
    if (path.startsWith("/exp/")) {
      const expSlug = path.split("/exp/")[1];
      return profile.experience.find((e) => e.slug === expSlug);
    }
    return null;
  }, [path]);

  const event = useMemo(() => {
    if (path.startsWith("/events/")) {
      const eventSlug = path.split("/events/")[1];
      return profile.events.find((e) => e.slug === eventSlug);
    }
    return null;
  }, [path]);

  const pageInfo = useMemo(() => {
    const pages: Record<string, { title: string; description: string; icon: React.ReactNode; color: string }> = {
      "/": {
        title: "Home",
        description: "Full Stack Developer & Open Source Enthusiast",
        icon: <User className="h-4 w-4" />,
        color: "text-blue-500"
      },
      "/about": {
        title: "About",
        description: "Learn more about the journey and background",
        icon: <User className="h-4 w-4" />,
        color: "text-green-500"
      },
      "/blogs": {
        title: "Blogs",
        description: "Technical articles and thoughts on development",
        icon: <ExternalLink className="h-4 w-4" />,
        color: "text-orange-500"
      },
      "/designs": {
        title: "Designs",
        description: "Portfolio designs and web development projects",
        icon: <Building className="h-4 w-4" />,
        color: "text-pink-500"
      },
      "/exp": {
        title: "Experience",
        description: "Professional experience and work history",
        icon: <Building className="h-4 w-4" />,
        color: "text-blue-500"
      },
      "/events": {
        title: "Events",
        description: "Hackathons, conferences, and tech events",
        icon: <Calendar className="h-4 w-4" />,
        color: "text-green-500"
      },
      "/gh-followers": {
        title: "GitHub Followers",
        description: "GitHub followers and community connections",
        icon: <User className="h-4 w-4" />,
        color: "text-gray-900 dark:text-gray-100"
      },
      "/prs": {
        title: "Pull Requests",
        description: "Open source contributions and pull requests",
        icon: <ExternalLink className="h-4 w-4" />,
        color: "text-green-600"
      },
      "/resume": {
        title: "Resume",
        description: "Download professional resume",
        icon: <ExternalLink className="h-4 w-4" />,
        color: "text-purple-500"
      }
    };

    return (
      pages[path] || {
        title: "Page",
        description: "Explore this page",
        icon: <ExternalLink className="h-4 w-4" />,
        color: "text-gray-500"
      }
    );
  }, [path]);

  if (experience) {
    return (
      <Card className="w-80 shadow-xl">
        <CardHeader>
          <div className="mb-1 flex items-center gap-2">
            <Building className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{experience.position}</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {experience.companyName} • {experience.location}
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <img
              src={ogImage.src || "/placeholder.svg"}
              alt={`${experience.companyName} experience`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mb-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>
              {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : "Present"}
            </span>
          </div>
          {experience.desc && (
            <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{experience.desc}</p>
          )}
          <Badge variant="outline" className="text-xs">
            {experience.expType}
          </Badge>
        </CardContent>
      </Card>
    );
  }

  if (event) {
    return (
      <Card className="w-80 shadow-xl">
        <CardHeader>
          <div className="mb-1 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{event.name}</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(event.date)}</p>
        </CardHeader>
        <CardContent>
          <div className="relative h-32 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <img src={ogImage.src || "/placeholder.svg"} alt={event.name} className="h-full w-full object-cover" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (path === "/contact") {
    return (
      <Card className="w-80 shadow-xl">
        <CardHeader>
          <div className="mb-1 flex items-center gap-2">
            <User className="h-4 w-4 text-purple-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Contact</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Get in touch for opportunities</p>
        </CardHeader>
        <CardContent>
          <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <img src={ogImage.src || "/placeholder.svg"} alt="Contact page" className="h-full w-full object-cover" />
          </div>
          <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
            Send a message or schedule a call to discuss projects, collaborations, or opportunities.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (path === "/gh-followers") {
    return (
      <Card className="w-80 shadow-xl">
        <CardHeader>
          <div className="mb-1 flex items-center gap-2">
            <User className="h-4 w-4 text-gray-900 dark:text-gray-100" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">GitHub Followers</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Community connections and network</p>
        </CardHeader>
        <CardContent>
          <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <img
              src={ogImage.src || "/placeholder.svg"}
              alt="GitHub Followers"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
            Explore the GitHub community and followers who support open source contributions and development journey.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (path === "/prs") {
    return (
      <Card className="w-80 shadow-xl">
        <CardHeader>
          <div className="mb-1 flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-green-600" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Pull Requests</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Open source contributions</p>
        </CardHeader>
        <CardContent>
          <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
            <img src={ogImage.src || "/placeholder.svg"} alt="Pull Requests" className="h-full w-full object-cover" />
          </div>
          <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
            Browse through open source contributions, pull requests, and code contributions to various projects.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80 shadow-xl">
      <CardHeader>
        <div className="mb-1 flex items-center gap-2">
          <span className={pageInfo.color}>{pageInfo.icon}</span>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{pageInfo.title}</h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{NEXT_PUBLIC_API_URL.replace("https://", "")}</p>
      </CardHeader>
      <CardContent>
        <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
          <img src={ogImage.src || "/placeholder.svg"} alt={pageInfo.title} className="h-full w-full object-cover" />
        </div>
      </CardContent>
    </Card>
  );
});

InternalPreview.displayName = "InternalPreview";

export const PreviewLink = forwardRef<
  HTMLAnchorElement,
  PreviewLinkProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof PreviewLinkProps>
>(({ href, children, className: _className, preFetch, ...props }, ref) => {
  const className = cn("px-0.5", _className);
  const router = useRouter();

  const isTouchDevice = useMemo(() => (typeof window !== "undefined" ? "ontouchstart" in window : false), []);

  const [hoverState, setHoverState] = useState<{
    isOpen: boolean;
    position: { vertical: "top" | "bottom"; horizontal: "left" | "center" | "right" };
  }>({
    isOpen: false,
    position: { vertical: "bottom", horizontal: "center" }
  });

  const [isMounted, setIsMounted] = useState(false);
  const [isPrefetched, setIsPrefetched] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isInternal = useMemo(() => isSameDomain(href), [href]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const springConfig = useMemo(() => ({ stiffness: 100, damping: 15 }), []);
  const x = useMotionValue(0);
  const translateX = useSpring(x, springConfig);

  const handlePrefetch = useCallback(() => {
    if (!isPrefetched && !isTouchDevice && isInternal && preFetch) {
      router.prefetch(href);
      setIsPrefetched(true);
    }
  }, [router, href, isPrefetched, isTouchDevice, isInternal, preFetch]);

  const updatePosition = useCallback(() => {
    if (linkRef.current && hoverState.isOpen) {
      const optimalPosition = getOptimalPosition(linkRef.current);
      setHoverState((prev) => ({ ...prev, position: optimalPosition }));
    }
  }, [hoverState.isOpen]);

  const throttledUpdatePosition = useMemo(() => throttle(updatePosition, 16), [updatePosition]);

  useEffect(() => {
    if (hoverState.isOpen) {
      updatePosition();

      window.addEventListener("scroll", throttledUpdatePosition, { passive: true });
      window.addEventListener("resize", throttledUpdatePosition, { passive: true });

      return () => {
        window.removeEventListener("scroll", throttledUpdatePosition);
        window.removeEventListener("resize", throttledUpdatePosition);
      };
    }
  }, [hoverState.isOpen, updatePosition, throttledUpdatePosition]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const targetRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const eventOffsetX = event.clientX - targetRect.left;
      const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2;
      x.set(offsetFromCenter);
    },
    [x]
  );

  const handleMouseEnter = useCallback(() => {
    setHoverState((prev) => ({ ...prev, isOpen: true }));

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      handlePrefetch();
    }, 100);
  }, [handlePrefetch]);

  const handleMouseLeave = useCallback(() => {
    setHoverState((prev) => ({ ...prev, isOpen: false }));

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const positionClasses = useMemo(() => {
    const { vertical, horizontal } = hoverState.position;

    let classes = "";

    if (vertical === "top") {
      classes += "bottom-full mb-2 ";
    } else {
      classes += "top-full mt-2 ";
    }

    switch (horizontal) {
      case "left":
        classes += "left-0";
        break;
      case "right":
        classes += "right-0";
        break;
      case "center":
      default:
        classes += "left-1/2 transform -translate-x-1/2";
        break;
    }

    return classes;
  }, [hoverState.position]);

  if (!isMounted || isTouchDevice) {
    return (
      <Link
        ref={ref}
        href={href}
        className={className}
        target={isInternal ? "_self" : "_blank"}
        rel={isInternal ? "" : "noopener noreferrer"}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link
        ref={(node) => {
          linkRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        href={href}
        className={cn(
          "px-0.5 text-gray-900 underline decoration-gray-400 underline-offset-4 transition-colors duration-200 hover:decoration-gray-900 dark:text-gray-100 dark:decoration-gray-500 dark:hover:decoration-gray-100",
          className
        )}
        target={isInternal ? "_self" : "_blank"}
        rel={isInternal ? "" : "noopener noreferrer"}
        onMouseMove={handleMouseMove}
        {...props}
      >
        {children}
      </Link>

      <AnimatePresence>
        {hoverState.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: hoverState.position.vertical === "top" ? 10 : -10, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 25
              }
            }}
            exit={{
              opacity: 0,
              y: hoverState.position.vertical === "top" ? 10 : -10,
              scale: 0.95,
              transition: { duration: 0.15 }
            }}
            className={cn("absolute z-50", positionClasses)}
            style={hoverState.position.horizontal === "center" ? { x: translateX } : undefined}
          >
            {isInternal ? <InternalPreview url={href} /> : <ExternalPreview url={href} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

PreviewLink.displayName = "PreviewLink";
