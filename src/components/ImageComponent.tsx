"use client";

import { User2Icon } from "lucide-react";
import { ReactNode, useState } from "react";

import { cn } from "@/lib/utils";

interface ImageComponentProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  containerClassName?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  placeholderIcon?: ReactNode;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
}

export function ImageComponent({
  src,
  alt,
  width,
  height,
  className,
  containerClassName,
  objectFit = "cover",
  placeholderIcon = <User2Icon className="h-1/5 w-1/5 text-muted-foreground" />,
  priority = false,
  sizes,
  ...props
}: ImageComponentProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  const objectFitClass = {
    contain: "object-contain",
    cover: "object-cover",
    fill: "object-fill",
    none: "object-none",
    "scale-down": "object-scale-down"
  }[objectFit];

  return (
    <div
      className={cn(containerClassName, "relative overflow-hidden", status === "loading" && "animate-pulse bg-muted")}
      style={{
        width: width || "100%",
        height: height || "auto"
      }}
      aria-busy={status === "loading"}
      role="img"
      aria-label={alt}
    >
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          className,
          objectFitClass,
          "transition-opacity duration-300",
          status === "loaded" ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        loading={priority ? "eager" : "lazy"}
        sizes={sizes}
        {...props}
      />

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
          status !== "loaded" ? "opacity-100" : "opacity-0",
          status === "loaded" && "pointer-events-none",
          status === "error" && "bg-muted/50"
        )}
      >
        {placeholderIcon}
      </div>
    </div>
  );
}
