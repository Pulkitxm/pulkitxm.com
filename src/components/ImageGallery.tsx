"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export interface ImageItem {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export default function ImageGallery({ images }: { images: ImageItem[] }) {
  return (
    <div className="w-full py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="group relative h-64 overflow-hidden rounded-lg bg-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="relative h-full w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(min-width: 1024px) calc(33vw - 2rem), (min-width: 640px) calc(50vw - 1rem), 100vw"
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
