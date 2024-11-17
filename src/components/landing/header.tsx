"use client";

import hacktoberFest from "@/assets/hacktoberfest.png";
import profile from "@/data/profile";
import { ImageDialog } from "./ImageDialog";
import Link from "next/link";
import { FaGithub, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function Header() {
  return (
    <>
      <div className="relative">
        <div className="block">
          <ImageDialog
            src={hacktoberFest}
            className="w-full rounded-lg object-cover"
          />
          <div className="absolute -bottom-10">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-background bg-background">
              <ImageDialog
                src={profile.image}
                className="rounded-full object-cover"
                fill
                rounded
                small
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-5 mt-12 pl-5">
        <p className="text-xl font-semibold text-white">{profile.name}</p>
        <p className="text-sm text-gray-300">{profile.caption}</p>
        <div className="my-2 flex space-x-3">
          <Link href={profile.links.linkedin} target="_blank">
            <FaLinkedinIn className="h-5 w-5 cursor-pointer text-gray-300 hover:text-gray-400" />
          </Link>
          <Link href={profile.links.github} target="_blank">
            <FaGithub className="h-5 w-5 cursor-pointer text-gray-300 hover:text-gray-400" />
          </Link>
          <Link href={profile.links.twitter} target="_blank">
            <FaTwitter className="h-5 w-5 cursor-pointer text-gray-300 hover:text-gray-400" />
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link href="/resume.pdf" target="_blank">
              <FileText className="mr-2 h-4 w-4" />
              Resume
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
