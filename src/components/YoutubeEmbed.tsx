"use client";

import { ExternalLink, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, memo } from "react";

type YouTubeEmbedProps = {
  videoId: string;
  title: string;
  className?: string;
};

const YouTubeEmbed = ({ videoId, title, className = "" }: YouTubeEmbedProps) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-xl border-2 border-white/30 ${className}`}>
      {!isLoaded ? (
        <>
          <button
            type="button"
            onClick={() => setIsLoaded(true)}
            className="relative h-full w-full"
            aria-label={`Play ${title}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
            <Image
              src={thumbnailUrl}
              alt={`Thumbnail for ${title}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-all duration-500"
              quality={80}
              priority
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center justify-center rounded-full bg-emerald-500 p-4 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-emerald-400">
                <Play className="h-8 w-8" />
              </div>
            </div>
          </button>
          <div className="group absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-lg border border-white/25 bg-black/80 px-4 py-3 backdrop-blur-sm">
            <Link
              href={`https://youtu.be/${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Open ${title} on YouTube`}
              className="line-clamp-1 text-left text-sm font-medium text-white group-hover:text-emerald-400 md:text-base"
            >
              {title}
            </Link>
            <Link
              href={`https://youtu.be/${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-white transition-all duration-300 hover:bg-black/90"
              aria-label={`Open ${title} on YouTube`}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4 text-white group-hover:text-emerald-400" />
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
};

export default memo(YouTubeEmbed, (prevProps, nextProps) => {
  return (
    prevProps.videoId === nextProps.videoId &&
    prevProps.title === nextProps.title &&
    prevProps.className === nextProps.className
  );
});
