"use client";

import { LogOut } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import { FaGithub, FaGoogle } from "react-icons/fa";

export function LoginButtons() {
  return (
    <div className="my-4 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
      <button
        onClick={() => signIn("google")}
        className="flex w-full items-center justify-center rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 sm:max-w-[200px]"
      >
        <FaGoogle className="mr-2 h-5 w-5" />
        Sign in with Google
      </button>
      <button
        onClick={() => signIn("github")}
        className="flex w-full items-center justify-center rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 sm:max-w-[200px]"
      >
        <FaGithub className="mr-2 h-5 w-5" />
        Sign in with GitHub
      </button>
    </div>
  );
}

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="flex items-center text-sm text-gray-400 transition-colors hover:text-white"
    >
      <LogOut className="mr-1 h-4 w-4" />
      Sign out
    </button>
  );
}
