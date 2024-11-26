"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HorizontalImageSliderProps {
  images: readonly string[];
  interval?: number;
}

export default function HorizontalImageSlider({
  images,
  interval = 5000,
}: HorizontalImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(
    new Array(images.length).fill(false),
  );

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  }, [images.length]);

  useEffect(() => {
    // Preload all images
    images.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImagesLoaded((prev) => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      };
    });

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [images, nextSlide, interval]);

  const allImagesLoaded = imagesLoaded.every(Boolean);

  if (!allImagesLoaded) {
    return (
      <div className="mx-auto aspect-[16/9] w-full max-w-4xl animate-pulse rounded-lg bg-gray-200" />
    );
  }

  return (
    <div className="relative mx-auto aspect-[16/9] w-full max-w-4xl overflow-hidden">
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div
            key={index}
            className="relative h-full w-full flex-shrink-0 rounded-lg"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "h-3 w-3 rounded-full transition-colors",
              index === currentIndex ? "bg-white" : "bg-white/50",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
