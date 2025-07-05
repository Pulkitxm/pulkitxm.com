"use client";

import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

import ImageGallery from "@/components/ImageGallery";
import { Event } from "@/types/profile";

export default function EventGalleryPage({ eventWithSlug }: { eventWithSlug: Event }) {
  const [isLoading, setIsLoading] = useState(true);

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
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-7xl space-y-8 px-4 pt-10 sm:px-6 lg:px-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{eventWithSlug.name} Gallery</h1>
        <p className="mb-8 text-lg text-gray-600 sm:text-xl">{eventWithSlug.tagline}</p>
      </div>
      <ImageGallery images={eventWithSlug.images} />
    </motion.div>
  );
}
