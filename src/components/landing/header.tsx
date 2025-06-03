"use client";

import { Check, Copy, FileText, Terminal } from "lucide-react";
import Link from "next/link";
import { useState, useCallback } from "react";

import assets from "@/assets";
import { Button } from "@/components/ui/button";
import profile, { links } from "@/data/profile";

export default function Header() {
  const [copied, setCopied] = useState<boolean>(false);

  const copyCommand = useCallback(() => {
    navigator.clipboard.writeText("npx pulkitxm");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <>
      <div className="relative">
        <div className="block">
          <img src={assets.header.src} className="w-full rounded-lg object-cover" alt="Hacktoberfest 2021" />
          <div className="absolute -bottom-10 left-5 md:-bottom-20">
            <div className="border-background bg-background relative size-20 overflow-hidden rounded-full border-4 md:size-40">
              <img src={profile.image.src} className="rounded-full object-cover" alt="Profile picture" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 mb-5 md:mt-24">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <p className="text-xl font-semibold text-white">{profile.name}</p>
          <Link
            href={`https://github.com/sponsors/${profile.githubUserName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md border border-[#363b42] bg-[#21262d] px-3 py-[5px] text-sm font-medium text-white no-underline transition-colors duration-150 hover:bg-[#30363d]"
          >
            <svg
              aria-hidden="true"
              height="16"
              viewBox="0 0 16 16"
              version="1.1"
              width="16"
              className="mr-2 text-[#db61a2]"
            >
              <path
                fill="currentColor"
                d="m8 14.25.345.666a.75.75 0 0 1-.69 0l-.008-.004-.018-.01a7.152 7.152 0 0 1-.31-.17 22.055 22.055 0 0 1-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.066 22.066 0 0 1-3.744 2.584l-.018.01-.006.003h-.002ZM4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.58 20.58 0 0 0 8 13.393a20.58 20.58 0 0 0 3.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.749.749 0 0 1-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5Z"
              />
            </svg>
            Sponsor
          </Link>
        </div>

        <p className="text-sm text-gray-300">{profile.caption}</p>

        <div className="my-3 flex flex-wrap items-center gap-3">
          {links.map(({ href, icon: Icon }, index) => (
            <Link key={index} href={href} target="_blank" aria-label={`Link to ${href}`}>
              <Icon className="h-5 w-5 cursor-pointer text-gray-300 hover:text-gray-400" />
            </Link>
          ))}

          <Button asChild variant="outline" size="sm" className="border-gray-800 hover:bg-gray-800">
            <Link href={profile.resumeLink} target="_blank">
              <FileText className="mr-2 h-4 w-4" />
              Resume
            </Link>
          </Button>
        </div>
      </div>

      <div
        onClick={copyCommand}
        className="mb-6 cursor-pointer rounded border border-green-900 bg-gray-900/50 px-4 py-2 transition-colors hover:bg-gray-800/60"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-green-400" />
            <code className="font-mono text-sm text-green-400">npx pulkitxm</code>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">Try my interactive CLI</span>
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-gray-400" />}
          </div>
        </div>
      </div>
    </>
  );
}
