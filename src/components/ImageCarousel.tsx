"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageSliderProps {
  images: readonly [string, ...string[]];
  interval?: number;
  autoPlay?: boolean;
  allowFullscreen?: boolean;
  allowZoom?: boolean;
  allowRotate?: boolean;
  showNavButtons?: boolean;
  showNavDots?: boolean;
  showPlayPause?: boolean;
}

export default function ImageSlider({
  images,
  autoPlay,
  allowFullscreen,
  allowRotate,
  allowZoom,
  showNavButtons,
  showNavDots,
  showPlayPause,
  interval = 2000,
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetImageState = useCallback(() => {
    setZoomLevel(1);
    setRotation(0);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
    resetImageState();
  }, [images.length, resetImageState]);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (!isPaused && autoPlay) {
      timeoutRef.current = setTimeout(nextSlide, interval);
    }
  }, [nextSlide, isPaused, autoPlay, interval]);

  const moveToIndex = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      resetTimeout();
    },
    [resetTimeout],
  );

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
    resetTimeout();
  }, [images.length, resetTimeout]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
    resetTimeout();
  }, [resetTimeout]);

  const toggleZoom = useCallback(() => {
    setZoomLevel((prev) => (prev + 1) % 3);
    resetTimeout();
  }, [resetTimeout]);

  const rotateImage = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
    resetTimeout();
  }, [resetTimeout]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      sliderRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    resetTimeout();
  }, [resetTimeout]);

  useEffect(() => {
    let loadedCount = 0;
    const totalImages = images.length;
    const preloadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          setLoadingProgress((loadedCount / totalImages) * 100);
          resolve(true);
        };
        img.onerror = reject;
      });
    };

    Promise.all(images.map(preloadImage))
      .then(() => {
        setImagesLoaded(true);
        setCurrentIndex(0);
        resetTimeout();
        setIsPaused(false);
      })
      .catch((err) => console.error("Error loading images:", err));
  }, [images, resetTimeout]);

  useEffect(() => {
    resetTimeout();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimeout]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        togglePause();
      }
      if (e.code === "ArrowRight") {
        nextSlide();
      }
      if (e.code === "Escape" && isFullscreen) {
        resetImageState();
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [togglePause, nextSlide, isFullscreen, resetImageState]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        prevSlide();
      } else if (event.key === "ArrowRight") {
        nextSlide();
      } else if (event.key === "Escape") {
        if (isFullscreen) {
          document.exitFullscreen();
        }
        resetImageState();
      } else if (event.key === " " || event.key.toLowerCase() === "k") {
        event.preventDefault();
        togglePause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nextSlide, prevSlide, isFullscreen, togglePause, resetImageState]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        resetImageState();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [resetImageState]);

  const zoomScales = [1, 1.5, 2];

  if (!imagesLoaded) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-xl bg-gray-100">
        <div className="text-center">
          <div className="mb-4 h-2.5 w-full rounded-full bg-gray-200">
            <div
              className="h-2.5 rounded-full bg-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p className="text-gray-600">
            Loading images... {Math.round(loadingProgress)}%
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={sliderRef}
      className={cn(
        "relative mx-auto select-none overflow-hidden rounded-xl shadow-2xl",
        isFullscreen ? "h-screen w-screen" : "aspect-[16/9] w-full max-w-4xl",
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => !isFullscreen && setIsPaused(false)}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {images.map((src, index) => (
          <div
            key={index}
            className="relative h-full w-full flex-shrink-0 overflow-hidden"
          >
            <Image
              src={src}
              className="absolute inset-0 h-full w-full scale-110 object-cover blur-md"
              alt={`Slide ${index} background`}
              loading="lazy"
              draggable="false"
              fill
            />

            <Image
              src={src}
              className={cn(
                "absolute inset-0 h-full w-full object-contain transition-all duration-300 ease-in-out",
              )}
              alt={`Slide ${index}`}
              loading="lazy"
              draggable="false"
              fill
              style={{
                transform: `rotate(${rotation}deg) scale(${zoomScales[zoomLevel]})`,
              }}
            />
          </div>
        ))}
      </div>

      {showNavButtons && (
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <button
            onClick={prevSlide}
            className="rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50 focus:outline-none focus:ring-offset-2 focus:ring-offset-black/10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextSlide}
            className="rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50 focus:outline-none focus:ring-offset-2 focus:ring-offset-black/10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center space-x-2">
        {showPlayPause && (
          <button
            onClick={togglePause}
            className="rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50 focus:outline-none focus:ring-offset-2 focus:ring-offset-black/10"
            aria-label={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </button>
        )}

        {showNavDots &&
          images.map((_, index) => (
            <button
              key={index}
              onClick={() => moveToIndex(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all focus:outline-none focus:ring-offset-2 focus:ring-offset-black/10",
                index === currentIndex
                  ? "w-8 bg-white"
                  : "bg-white/50 hover:bg-white/80",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        {allowZoom && (
          <button
            onClick={toggleZoom}
            className="rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50 focus:outline-none"
            aria-label={zoomLevel === 2 ? "Reset zoom" : "Zoom in"}
          >
            {zoomLevel === 2 ? (
              <ZoomOut className="h-4 w-4" />
            ) : (
              <ZoomIn className="h-4 w-4" />
            )}
          </button>
        )}

        {allowRotate && (
          <button
            onClick={rotateImage}
            className="rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50 focus:outline-none"
            aria-label="Rotate image"
          >
            <RotateCw className="h-4 w-4" />
          </button>
        )}

        {allowFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/50 focus:outline-none"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
