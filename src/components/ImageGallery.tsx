"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { useRef } from "react";
import { Gallery, Item } from "react-photoswipe-gallery";

export interface ImageItem {
  src: string;
  alt: string;
}

export default function ImageGallery({ images }: { images: StaticImageData[] }) {
  return (
    <Gallery>
      <div className="w-full py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {images.map((image, index) => (
              <ParallaxImage key={index} image={image} index={index} />
            ))}
          </div>
        </div>
      </div>
    </Gallery>
  );
}
function ParallaxImage({ image, index }: { image: StaticImageData; index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  return (
    <motion.div
      ref={ref}
      className="group relative h-64 overflow-hidden rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <Item thumbnail={image.src} original={image.src} width={image.width} height={image.height}>
          {({ ref, open }) => (
            <Image
              src={image.src}
              alt={`Gallery Image ${index + 1}`}
              ref={ref}
              onClick={open}
              fill
              sizes="(min-width: 1024px) calc(33vw - 2rem), (min-width: 640px) calc(50vw - 1rem), 100vw"
              className="-translate-x-[5%] -translate-y-[5%] scale-125 cursor-pointer object-cover"
              priority
            />
          )}
        </Item>
      </motion.div>
    </motion.div>
  );
}
