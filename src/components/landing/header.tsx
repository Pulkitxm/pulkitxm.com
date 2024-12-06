"use client";

import profile, { links } from "@/data/profile";
import { ImageDialog } from "./ImageDialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import assets from "@/data/assets";

export default function Header() {
  return (
    <>
      <div className="relative">
        <div className="block">
          <ImageDialog
            src={assets.hacktoberFest}
            className="w-full rounded-lg object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute -bottom-10">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-background bg-background">
              <ImageDialog
                src={profile.image}
                className="rounded-full object-cover"
                fill
                rounded
                small
                width={100}
                height={100}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-5 mt-12 pl-5">
        <p className="text-xl font-semibold text-white">{profile.name}</p>
        <p className="text-sm text-gray-300">{profile.caption}</p>
        <div className="my-2 flex items-center space-x-3">
          {links.map(({ href, icon: Icon }, index) => (
            <Link key={index} href={href} target="_blank">
              <Icon className="h-5 w-5 cursor-pointer text-gray-300 hover:text-gray-400" />
            </Link>
          ))}

          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-gray-800 hover:bg-gray-800"
          >
            <Link href={profile.resumeLink} target="_blank">
              <FileText className="mr-2 h-4 w-4" />
              Resume
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
