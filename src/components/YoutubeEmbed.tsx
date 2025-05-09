"use client";

import { ExternalLink, Play } from "lucide-react";
import Link from "next/link";
import { useState, memo } from "react";

type YouTubeEmbedProps = {
  videoId: string;
  title: string;
  className?: string;
};

export default memo(
  function YouTubeEmbed({ videoId, title, className = "" }: YouTubeEmbedProps) {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    return (
      <div
        className={`relative aspect-video w-full overflow-hidden rounded-xl border-2 border-white/30 ${className}`}
        data-testid="youtube-embed"
      >
        {!isLoaded ? (
          <>
            <button
              type="button"
              onClick={() => setIsLoaded(true)}
              className="relative h-full w-full"
              aria-label={`Play ${title}`}
            >
              <div className="absolute inset-0 bg-linear-to-t from-black/70 to-black/10" />
              <img
                src={thumbnailUrl}
                alt={`Thumbnail for ${title}`}
                sizes="(min-width: 1024px) 50vw, (min-width: 768px) 70vw, 100vw"
                className="object-cover transition-transform duration-300 hover:scale-105"
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="flex items-center justify-center rounded-full bg-emerald-500 p-3 text-white shadow-xl transition-transform duration-300 hover:scale-110 hover:bg-emerald-400 sm:p-4">
                  <Play className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
              </div>
            </button>
            <div className="group absolute right-3 bottom-3 left-3 flex items-center justify-between rounded-lg border border-white/25 bg-black/80 px-3 py-2 backdrop-blur-sm sm:right-4 sm:bottom-4 sm:left-4 sm:px-4 sm:py-3">
              <Link
                href={`https://youtu.be/${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Open ${title} on YouTube`}
                className="line-clamp-1 text-left text-xs font-medium text-white group-hover:text-emerald-400 sm:text-sm md:text-base"
              >
                {title}
              </Link>
              <Link
                href={`https://youtu.be/${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/80 text-white transition-colors duration-300 hover:bg-black/90 sm:h-8 sm:w-8"
                aria-label={`Open ${title} on YouTube`}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3 w-3 text-white group-hover:text-emerald-400 sm:h-4 sm:w-4" />
              </Link>
            </div>
          </>
        ) : (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
            allowFullScreen
          />
        )}
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.videoId === nextProps.videoId &&
    prevProps.title === nextProps.title &&
    prevProps.className === nextProps.className
);
