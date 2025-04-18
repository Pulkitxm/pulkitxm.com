"use client";

import { StaticImageData } from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface SimpleCarouselProps {
  images: StaticImageData[];
  showNavigation?: boolean;
  autoMove?: boolean;
  autoMoveInterval?: number;
}

export default function SimpleCarousel({
  images,
  showNavigation = true,
  autoMove = true,
  autoMoveInterval = 5000
}: SimpleCarouselProps) {
  const [api, setApi] = useState<ReturnType<typeof useCarousel>["api"] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    isTouchDevice.current = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }, []);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const startTimeout = useCallback(() => {
    if (autoMove && !isPaused) {
      resetTimeout();
      timeoutRef.current = setTimeout(() => {
        api?.scrollNext();
      }, autoMoveInterval);
    }
  }, [api, autoMove, autoMoveInterval, isPaused, resetTimeout]);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
      startTimeout();
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
      resetTimeout();
    };
  }, [api, startTimeout, resetTimeout]);

  useEffect(() => {
    startTimeout();
    return resetTimeout;
  }, [startTimeout, resetTimeout]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
      resetTimeout();
      startTimeout();
    },
    [api, resetTimeout, startTimeout]
  );

  const handleMouseEnter = useCallback(() => {
    if (!isTouchDevice.current) {
      setIsPaused(true);
      resetTimeout();
    }
  }, [resetTimeout]);

  const handleMouseLeave = useCallback(() => {
    if (!isTouchDevice.current) {
      setIsPaused(false);
      startTimeout();
    }
  }, [startTimeout]);

  return (
    <div className="relative mx-auto w-full max-w-5xl" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true
        }}
      >
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={src.src}
                  alt={`Background ${index + 1}`}
                  width={50}
                  height={50}
                  className="h-full w-full scale-110 select-none object-cover blur-md brightness-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src={src.src} alt={`Slide ${index + 1}`} className="h-full w-full select-none object-contain" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {showNavigation && (
          <>
            <CarouselPrevious className="left-4 bg-black/50 text-white hover:bg-black/75 md:left-8" />
            <CarouselNext className="right-4 bg-black/50 text-white hover:bg-black/75 md:right-8" />
          </>
        )}
      </Carousel>
      {showNavigation && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                currentIndex === index ? "w-4 bg-white" : "bg-white/50"
              )}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ImageFader({ images, alt }: { images: StaticImageData[]; alt: string }) {
  const TIMER = 5000;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, TIMER);

    return () => clearInterval(intervalId);
  }, [images, TIMER]);

  return (
    <div className="relative aspect-[16/9] h-full w-full overflow-hidden lg:aspect-auto">
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative h-full w-full">
            <img
              src={src.src || "/placeholder.svg"}
              alt={`Background ${index + 1}`}
              className="h-full w-full object-cover blur-md brightness-50"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-full w-full">
              <img
                src={src.src || "/placeholder.svg"}
                alt={`${alt} - Image ${index + 1}`}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
