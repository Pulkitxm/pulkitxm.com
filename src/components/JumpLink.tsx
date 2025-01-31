"use client";

import { Link2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

interface JumpLinkProps {
  path: string;
  url: {
    key: string;
    id: string;
  };
  className?: {
    master?: string;
    child?: string;
  };
}

export default function JumpLink(props: JumpLinkProps) {
  return (
    <Suspense fallback={null}>
      <JumpLinkContent {...props} />
    </Suspense>
  );
}

function JumpLinkContent({ path, url, className }: JumpLinkProps) {
  const queryParam = useSearchParams();

  useEffect(() => {
    const jumpContainer = document.getElementById(url.key + "-" + url.id);

    if (!jumpContainer) return;

    if (queryParam.get(url.key) == url.id) {
      const yOffset = window.innerHeight < 800 ? -100 : -200;

      const y = jumpContainer.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [queryParam, url]);

  return (
    <Link href={`${path}?${url.key}=${url.id}`} className={className?.master}>
      <Link2 className={className?.child} />
    </Link>
  );
}
