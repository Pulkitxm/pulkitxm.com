"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AnimatedMain({
  ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) {
  const pathname = usePathname();
  const [key, setKey] = useState("");

  useEffect(() => {
    setKey(pathname);
  }, [pathname]);

  return <main key={key} {...props} />;
}
