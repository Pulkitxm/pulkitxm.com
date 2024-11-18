import profile from "@/data/profile";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function Component() {
  return (
    <Link
      href={profile.sourceCodeUrl}
      className="fixed bottom-4 right-4 z-50 hidden lg:block"
      aria-label="View source on GitHub"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="group relative">
        <div className="animate-spin-slow absolute -inset-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-75 blur-md transition-opacity group-hover:opacity-100" />
        <div className="relative rounded-full bg-black p-2 ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-110">
          <FaGithub className="h-8 w-8 text-white transition-colors group-hover:text-blue-200" />
        </div>
      </div>
    </Link>
  );
}
