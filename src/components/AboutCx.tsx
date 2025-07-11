import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export function LinkComponent({ href, children, unColored }: { href: string; children: string; unColored?: boolean }) {
  return (
    <Link
      href={href}
      className={`ml-1 inline-flex items-center underline ${unColored ? "text-foreground" : "text-blue-700 dark:text-blue-300"} hover:text-blue-800 dark:hover:text-blue-200`}
      target="_blank"
    >
      {children}
      &nbsp;
      <ExternalLink className="inline size-4" />
    </Link>
  );
}

export function HighlightComponent({ children }: { children: string }) {
  return <code className="mx-1 rounded-md bg-gray-300 p-1 pb-0.5 dark:bg-gray-700">&quot;{children}&quot;</code>;
}

export function Section({ children }: { children: ReactNode }) {
  return <section className="mb-6">{children}</section>;
}
