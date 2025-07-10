"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Calendar, Building, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, forwardRef, useRef } from "react";

import profile from "@/data/profile";
import { NEXT_PUBLIC_API_URL } from "@/lib/constants";
import { getCachedData, setCachedData } from "@/lib/gh";
import { cn, getOgImageFromUrl, formatDate, isSameDomain } from "@/lib/utils";

import type { OgData } from "@/types/og";

type PositionType = {
  vertical: "top" | "bottom";
  horizontal: "left" | "center" | "right";
};

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
  const variants = {
    default: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    outline: "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-transparent",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={cn("animate-pulse rounded bg-gray-200 dark:bg-gray-700", className)} />
);

const truncateUrl = (url: string, maxLength = 50) => {
  if (url.length <= maxLength) return url;
  const half = Math.floor(maxLength / 2);
  return `${url.slice(0, half)}...${url.slice(-half)}`;
};

const getPosition = (element: HTMLElement): PositionType => {
  const rect = element.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const elementCenter = rect.left + rect.width / 2;
  const spaceRight = window.innerWidth - elementCenter;

  return {
    vertical: spaceBelow < 270 && spaceAbove > 270 ? "top" : "bottom",
    horizontal: spaceRight < 160 ? "right" : elementCenter < 160 ? "left" : "center"
  };
};

const PreviewSkeleton = () => (
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

const ExternalPreview = ({ url }: { url: string }) => {
  const [ogData, setOgData] = useState<OgData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cacheKey = `og-data-${btoa(url).replace(/[^a-zA-Z0-9]/g, "")}`;
        const cached = await getCachedData<OgData>(cacheKey);

        if (cached) {
          setOgData(cached);
          setIsLoading(false);
          return;
        }

        const response = await fetch(`/api/og?${new URLSearchParams({ url })}`);
        const data = await response.json();

        if (data.success && data.data) {
          const result = {
            title: data.data.title,
            description: data.data.description,
            image: data.data.image,
            url: data.data.url,
            siteName: data.data.siteName,
            favicon: data.data.favicon
          };
          setOgData(result);
          setCachedData(cacheKey, result);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  if (isLoading) return <PreviewSkeleton />;

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
          {ogData.favicon && <img src={ogData.favicon} alt="" className="h-4 w-4 rounded" />}
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
            <img src={ogData.image} alt={ogData.title || "Preview"} className="h-full w-full object-cover" />
          </div>
        )}
        {ogData.description && (
          <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{ogData.description}</p>
        )}
      </CardContent>
    </Card>
  );
};

const InternalPreview = ({ url }: { url: string }) => {
  const ogImage = getOgImageFromUrl(url);

  const path = (() => {
    try {
      if (url.startsWith("/")) return url;
      if (url.startsWith("http")) return new URL(url).pathname;
      return `/${url}`;
    } catch {
      return url.startsWith("/") ? url : `/${url}`;
    }
  })();

  const experience = path.startsWith("/exp/")
    ? profile.experience.find((e) => e.slug === path.split("/exp/")[1])
    : null;

  const event = path.startsWith("/events/") ? profile.events.find((e) => e.slug === path.split("/events/")[1]) : null;

  const pageInfo = {
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
    "/contact": {
      title: "Contact",
      description: "Get in touch for opportunities",
      icon: <User className="h-4 w-4" />,
      color: "text-purple-500"
    },
    "/resume": {
      title: "Resume",
      description: "Download professional resume",
      icon: <ExternalLink className="h-4 w-4" />,
      color: "text-purple-500"
    }
  }[path] || {
    title: "Page",
    description: "Explore this page",
    icon: <ExternalLink className="h-4 w-4" />,
    color: "text-gray-500"
  };

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
              src={ogImage.src}
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
          <Badge variant="outline">{experience.expType}</Badge>
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
            <img src={ogImage.src} alt={event.name} className="h-full w-full object-cover" />
          </div>
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
          <img src={ogImage.src} alt={pageInfo.title} className="h-full w-full object-cover" />
        </div>
        {path === "/contact" && (
          <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
            Send a message or schedule a call to discuss projects, collaborations, or opportunities.
          </p>
        )}
        {path === "/gh-followers" && (
          <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
            Explore the GitHub community and followers who support open source contributions.
          </p>
        )}
        {path === "/prs" && (
          <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
            Browse through open source contributions and pull requests to various projects.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface PreviewLinkProps {
  href: string;
  children?: React.ReactNode;
  className?: string;
  preFetch?: boolean;
  underline?: boolean;
}

export const PreviewLink = forwardRef<
  HTMLAnchorElement,
  PreviewLinkProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof PreviewLinkProps>
>(({ href, children, className: _className, preFetch, underline, ...props }, ref) => {
  const className = cn("px-0.5", _className, underline && "underline");
  const router = useRouter();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<PositionType>({ vertical: "bottom", horizontal: "center" });
  const [isMounted, setIsMounted] = useState(false);

  const isInternal = isSameDomain(href);
  const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (isTouchDevice) return;

    setIsOpen(true);

    if (linkRef.current) {
      setPosition(getPosition(linkRef.current));
    }

    if (preFetch && isInternal) {
      timeoutRef.current = setTimeout(() => {
        router.prefetch(href);
      }, 100);
    }
  }, [href, isInternal, preFetch, router, isTouchDevice]);

  const handleMouseLeave = useCallback(() => {
    setIsOpen(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses = `absolute z-50 ${position.vertical === "top" ? "bottom-full mb-2" : "top-full mt-2"} ${
    position.horizontal === "left"
      ? "left-0"
      : position.horizontal === "right"
        ? "right-0"
        : "left-1/2 -translate-x-1/2"
  }`;

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
    <div className="relative inline" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link
        ref={(node) => {
          linkRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        href={href}
        className={className}
        target={isInternal ? "_self" : "_blank"}
        rel={isInternal ? "" : "noopener noreferrer"}
        {...props}
      >
        {children}
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: position.vertical === "top" ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position.vertical === "top" ? 10 : -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={positionClasses}
          >
            {isInternal ? <InternalPreview url={href} /> : <ExternalPreview url={href} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

PreviewLink.displayName = "PreviewLink";
