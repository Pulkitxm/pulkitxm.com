"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function ImageDialog({
  src: image,
  className,
  fill,
  rounded,
  small,
  width,
  height
}: {
  src: string;
  className?: string;
  fill?: boolean;
  rounded?: boolean;
  small?: boolean;
  width: number;
  height: number;
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

  // Close on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent scrolling when dialog is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={`${fill ? "h-full w-full" : ""} overflow-hidden`}>
        <Image
          fill={fill}
          src={image}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          alt="Profile picture"
          className={`${className} transform transition duration-200`}
          fetchPriority="high"
          loading="eager"
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
        >
          <div className="relative">
            <Image
              src={image}
              alt="Profile picture"
              className={`w-full transform object-contain transition duration-300 ${rounded ? "rounded-full" : ""}`}
              width={small ? 400 : 800}
              height={small ? 400 : rounded ? 800 : 600}
              fetchPriority="high"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </>
  );
}
