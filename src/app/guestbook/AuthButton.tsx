"use client";

import { LogOut } from "lucide-react";
import { signIn, signOut } from "next-auth/react";
import { FaGithub, FaGoogle } from "react-icons/fa";

export function LoginButtons() {
  return (
    <div className="my-4 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
      <button
        onClick={() => signIn("google")}
        className="bg-background text-foreground hover:bg-muted border-input dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors sm:max-w-[200px]"
      >
        <FaGoogle className="mr-2 h-5 w-5" />
        Sign in with Google
      </button>
      <button
        onClick={() => signIn("github")}
        className="bg-background text-foreground hover:bg-muted border-input dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors sm:max-w-[200px]"
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
      className="text-muted-foreground hover:text-foreground flex items-center text-sm transition-colors"
    >
      <LogOut className="mr-1 h-4 w-4" />
      Sign out
    </button>
  );
}
