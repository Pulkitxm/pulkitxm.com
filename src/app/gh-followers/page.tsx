import axios from "axios";
import { Github, Users } from "lucide-react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

import { getGithubUsername } from "@/actions/gh";
import { ImageComponent } from "@/components/ImageComponent";
import { NEXT_PUBLIC_API_URL } from "@/lib/constants";
import { RES_TYPE } from "@/types/globals";

export default async function GhFollowers() {
  let followersRes: RES_TYPE<
    {
      picUrl: string;
      username: string;
    }[]
  >;
  const githubUsername = await getGithubUsername();

  try {
    const res = await axios.get(`${NEXT_PUBLIC_API_URL}/api/gh/followers`);
    followersRes = res.data;
  } catch (e) {
    followersRes = { status: "error", error: "Unable to load followers" };
    console.error(e);
  }

  if (followersRes.status === "error" || githubUsername.status === "error") {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg bg-zinc-900/50">
        <p className="text-sm text-red-400">Unable to load followers</p>
      </div>
    );
  }

  return (
    <main className="space-y-6 p-3 sm:p-5">
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-zinc-900/90 to-zinc-800/90 p-6">
        <div className="absolute inset-0 bg-linear-to-br from-green-500/10 to-purple-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent)]" />
        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">
              <Github className="h-4 w-4" />
              <span>GitHub Network</span>
            </div>
            <Link
              href={`https://github.com/${githubUsername.data}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <h2 className="text-2xl font-bold text-zinc-100 transition-colors hover:text-green-400">My Followers</h2>
            </Link>
            <p className="text-sm text-zinc-400">
              These are the amazing people who follow my journey on GitHub. Each follower helps build a stronger
              developer community.
            </p>
          </div>
          <div className="flex items-center space-x-3 rounded-full border border-zinc-700/50 bg-zinc-800/50 px-4 py-2 text-zinc-100">
            <Users className="h-5 w-5 text-green-400" />
            <span className="text-lg font-semibold">{followersRes.data.length}</span>
            <span className="text-sm text-zinc-400">followers</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {followersRes.data.map((follower, index) => (
          <Link
            key={index}
            href={`https://github.com/${follower.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center rounded-lg bg-zinc-900/50 p-4 transition hover:bg-zinc-800/50"
          >
            <div className="relative size-24 overflow-hidden rounded-full sm:size-28">
              <ImageComponent
                src={follower.picUrl || "/placeholder.svg"}
                alt={`${follower.username}'s profile`}
                width={112}
                height={112}
                priority={index < 8}
                className="object-cover grayscale transition duration-300 group-hover:grayscale-0"
              />
            </div>

            <div className="mt-3 flex w-full flex-wrap items-center justify-center gap-0.5">
              <FaGithub className="h-4 w-4 group-hover:text-green-400" />
              <span className="truncate text-center text-sm text-zinc-300 transition group-hover:text-green-400">
                /
              </span>
              <span className="max-w-full truncate text-center text-sm text-zinc-300 transition group-hover:text-green-400">
                @{follower.username}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {followersRes.data.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg bg-zinc-900/50 px-4 py-12">
          <Users className="mb-3 h-8 w-8 text-zinc-400" />
          <p className="text-sm text-zinc-300">No followers yet</p>
        </div>
      )}
    </main>
  );
}

export const dynamic = "force-dynamic";
