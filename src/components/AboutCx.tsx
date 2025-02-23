import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export function LinkComponent({ href, children, unColored }: { href: string; children: string; unColored?: boolean }) {
  return (
    <Link
      href={href}
      className={`ml-1 inline-flex items-center ${unColored ? "" : "text-[#4ecdff]"} hover:underline`}
      target="_blank"
    >
      {children}
      &nbsp;
      <ExternalLink className="inline size-4" />
    </Link>
  );
}

export function HighlightComponent({ children }: { children: string }) {
  return <code className="mx-1 rounded-md bg-gray-700 p-1 pb-0.5">&quot;{children}&quot;</code>;
}

export function Section({ children }: { children: ReactNode }) {
  return <section className="mb-6">{children}</section>;
}
