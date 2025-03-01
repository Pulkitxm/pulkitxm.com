"use client";

import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

export function ImageDialog({
  src: image,
  className,
  rounded,
  size,
  small,
  alt,
  priority,
  bg
}: {
  src: StaticImageData;
  className?: string;
  rounded?: boolean;
  small?: boolean;
  size: {
    width: number;
    height: number;
  };
  alt: string;
  priority?: boolean;
  bg?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="h-full w-full overflow-hidden"
        style={{
          backgroundColor: bg
        }}
      >
        <Image
          src={image}
          width={size.width}
          height={size.height}
          alt={alt}
          className={`${className} transform transition duration-200`}
          fetchPriority="high"
          loading="eager"
          priority={priority}
        />
      </button>

      <div
        className={`fixed inset-0 z-50 ${
          isOpen ? "flex" : "hidden"
        } items-center justify-center p-4 backdrop-blur-sm ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}`}
        onClick={handleClose}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-100"}`}
        />

        <div
          className={`relative z-10 transform overflow-hidden bg-black transition-all duration-300 ${small ? "max-h-[400px] max-w-sm" : "max-h-[80vh] max-w-4xl"} ${isClosing ? "opacity-0" : "opacity-100"} ${rounded ? "rounded-full" : "rounded-lg"} `}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: bg
          }}
        >
          <div className="relative">
            <Image
              src={image}
              alt="Profile picture"
              className={`w-full transform object-contain transition duration-300 ${rounded ? "rounded-full" : ""}`}
              unoptimized
              fetchPriority="high"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </>
  );
}
