import links from "@/data/pages";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <div className="flex w-full justify-end gap-2">
      <ul>
        {links.map((link, index) => (
          <li
            key={index}
            className="mx-2 inline-block text-gray-300 hover:text-gray-900"
          >
            <Link href={link.url}>{link.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
