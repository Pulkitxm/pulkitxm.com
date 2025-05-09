"use client";

import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

import ImageGallery from "@/components/ImageGallery";
import profile from "@/data/profile";

import "photoswipe/dist/photoswipe.css";

export default function EventGalleryPage({ eventSlug }: { eventSlug: string }) {
  const [isLoading, setIsLoading] = useState(true);

  const eventWithSlug = profile.events.find((e) => e.slug === eventSlug);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (eventWithSlug === undefined) {
    return notFound();
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-7xl space-y-8 px-4 pt-10 sm:px-6 lg:px-8"
    >
      <div className="text-center">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2 text-3xl font-bold sm:text-4xl lg:text-5xl"
        >
          {eventWithSlug.name} Gallery
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 text-lg text-gray-600 sm:text-xl"
        >
          {eventWithSlug.tagline}
        </motion.p>
      </div>
      <ImageGallery images={eventWithSlug.images} />
    </motion.main>
  );
}
