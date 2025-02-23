"use client";

import { LogOut, Mail } from "lucide-react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { FaGithub } from "react-icons/fa";

export default function GuestbookPage() {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Add your submission logic here
    setMessage("");
  };

  return (
    <main className="py-12">
      <div className="text-center">
        {session ? (
          <>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Hi {session.user?.name?.split(" ")[0]}, thanks for stopping by!
            </h1>
            <p className="mt-3 text-lg text-gray-400">Feel free to leave a message in my guestbook.</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Hi there, would you like to sign my guestbook?
            </h1>
            <p className="mt-3 text-lg text-gray-400">Sign in to leave a message and let me know you were here!</p>
          </>
        )}
      </div>

      {!session ? (
        <div className="mt-8 flex items-center space-x-4">
          <button
            onClick={() => signIn("github")}
            className="flex w-full items-center justify-center rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            <FaGithub className="mr-2 h-5 w-5" />
            Sign in with GitHub
          </button>

          <button
            onClick={() => signIn("google")}
            className="flex w-full items-center justify-center rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            <Mail className="mr-2 h-5 w-5" />
            Sign in with Google
          </button>
        </div>
      ) : (
        <div className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src={session.user?.image || "/api/placeholder/32/32"}
                alt={session.user?.name || "Avatar"}
                className="h-8 w-8 rounded-full"
                width={32}
                height={32}
              />
              <span className="font-medium text-white">{session.user?.name}</span>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center text-sm text-gray-400 transition-colors hover:text-white"
            >
              <LogOut className="mr-1 h-4 w-4" />
              Sign out
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="message" className="sr-only">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                className="max-h-[300px] min-h-[150px] w-full rounded-md border-zinc-700 bg-zinc-800 p-3 text-white placeholder-gray-400 outline-none focus:border-green-500 focus:ring-green-500"
                placeholder="Write a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                Sign Guestbook
              </button>
            </div>
          </form>

          <div className="mt-8 space-y-6">{/* Guestbook entries would go here */}</div>
        </div>
      )}
    </main>
  );
}
