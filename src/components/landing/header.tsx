"use client";

import hacktoberFest from "@/assets/hacktoberfest.png";
import profile from "@/data/profile";
import { ImageDialog } from "./ImageDialog";

export default function Header() {
  return (
    <>
      <div className="relative">
        <div className="block">
          <ImageDialog
            src={hacktoberFest}
            className="w-full rounded-lg object-cover"
          />
          <div className="absolute -bottom-20">
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
      <div className="mt-20 pl-5">
        <p className="text-xl font-semibold text-white">{profile.name}</p>
        <p className="text-sm text-gray-300">{profile.caption}</p>
      </div>
    </>
  );
}
