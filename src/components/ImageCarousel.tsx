/* eslint-disable no-unused-vars */
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  images: readonly string[];
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.95,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

function Controls({
  paginate,
  images,
  setPage,
  slideIndex,
  resetTimeout,
}: {
  paginate: (newDirection: number) => void;
  images: readonly string[];
  setPage: React.Dispatch<React.SetStateAction<[number, number]>>;
  slideIndex: number;
  resetTimeout: () => void;
}) {
  return (
    <>
      <div className="absolute inset-0 z-10 flex items-center justify-between p-2 sm:p-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            resetTimeout();
            paginate(-1);
          }}
          className="rounded-full bg-black/70 p-2 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/90 sm:p-3"
        >
          <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            resetTimeout();
            paginate(1);
          }}
          className="rounded-full bg-black/70 p-2 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/90 sm:p-3"
        >
          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
        </motion.button>
      </div>
      <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 transform space-x-1.5 sm:bottom-4 sm:space-x-2">
        {images.map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => {
              resetTimeout();
              setPage([index, index > slideIndex ? 1 : -1]);
            }}
            className={`h-2 w-2 rounded-full shadow-lg transition-colors sm:h-3 sm:w-3 ${
              index === slideIndex ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
}

export default function ImageCarousel({ images }: CarouselProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const slideIndex = Math.abs(page % images.length);

  const paginate = useCallback(
    (newDirection: number) => {
      setPage([page + newDirection, newDirection]);
    },
    [page],
  );

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      paginate(1);
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [paginate]);

  const resetTimeout = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      paginate(1);
    }, 3000);
  }, [paginate]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  return (
    <div
      className="relative mx-auto mt-4 h-[250px] w-full max-w-4xl overflow-hidden rounded-lg sm:mt-8 sm:h-[350px] md:h-[450px] lg:h-[500px]"
      onMouseEnter={stopInterval}
      onMouseLeave={resetTimeout}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={page}
          src={images[slideIndex]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 250, damping: 30, mass: 0.8 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
          }}
          className="absolute h-full w-full rounded-lg object-cover"
          alt={`Slide ${slideIndex + 1}`}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(_, info) => {
            const swipe = swipePower(info.offset.x, info.velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        />
      </AnimatePresence>
      <Controls
        paginate={paginate}
        images={images}
        setPage={setPage}
        slideIndex={slideIndex}
        resetTimeout={resetTimeout}
      />
    </div>
  );
}
