import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface QuoteProps {
  children: ReactNode;
  className?: string;
  name: string;
  designation: string;
  image: StaticImageData;
}

export function Quote({ children, name, designation, image, className }: QuoteProps) {
  return (
    <div
      className={cn(
        "mt-6 border-l-2 border-slate-300 pt-2 pl-4 text-slate-800 italic sm:pl-6 md:border-l-4 dark:border-slate-700 dark:text-slate-200",
        className
      )}
    >
      <blockquote className="text-base leading-relaxed text-slate-800 sm:text-lg dark:text-slate-200">
        {children}
      </blockquote>
      <div className="mt-4 flex items-center gap-3 sm:gap-4">
        <Image
          src={image}
          alt={name}
          className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12"
          width={48}
          height={48}
        />
        <div>
          <div className="text-sm font-medium text-slate-900 sm:text-base dark:text-slate-100">{name}</div>
          <div className="text-xs text-slate-600 sm:text-sm dark:text-slate-400">{designation}</div>
        </div>
      </div>
    </div>
  );
}
