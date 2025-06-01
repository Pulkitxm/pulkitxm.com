"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AnimatedMain({ ...props }: HTMLMotionProps<"main">) {
  const pathname = usePathname();
  const [key, setKey] = useState("");

  useEffect(() => {
    setKey(pathname);
  }, [pathname]);

  return (
    <motion.main
      key={key}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 1, ease: "easeOut" }}
      {...props}
    />
  );
}
