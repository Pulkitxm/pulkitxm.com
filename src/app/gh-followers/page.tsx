import axios from "axios";
import { Github, Users } from "lucide-react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

import { getGithubUsername } from "@/actions/gh";
import assets from "@/assets";
import { ImageComponent } from "@/components/ImageComponent";
import { NEXT_PUBLIC_API_URL } from "@/lib/constants";
import { createMetadata } from "@/lib/utils";
import { RES_TYPE } from "@/types/globals";

import type { Metadata } from "next";

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
      <div className="bg-muted flex h-32 items-center justify-center rounded-lg">
        <p className="text-destructive text-sm">Unable to load followers</p>
      </div>
    );
  }

  return (
    <>
      <div className="from-primary/10 to-secondary/10 relative overflow-hidden rounded-2xl bg-gradient-to-br p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-purple-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent)]" />
        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-600 dark:text-green-400">
              <Github className="h-4 w-4" />
              <span>GitHub Network</span>
            </div>
            <Link
              href={`https://github.com/${githubUsername.data}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <h2 className="text-foreground text-2xl font-bold transition-colors hover:text-green-400">
                My Followers
              </h2>
            </Link>
            <p className="muted-foreground text-sm">
              These are the amazing people who follow my journey on GitHub. Each follower helps build a stronger
              developer community.
            </p>
          </div>
          <div className="border-border bg-card text-foreground flex items-center space-x-3 rounded-full border px-4 py-2">
            <Users className="h-5 w-5 text-green-400" />
            <span className="text-lg font-semibold">{followersRes.data.length}</span>
            <span className="muted-foreground text-sm">followers</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {followersRes.data.map((follower, index) => (
          <Link
            key={index}
            href={`https://github.com/${follower.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card flex flex-col items-center rounded-lg p-4 transition"
          >
            <div className="group relative size-24 overflow-hidden rounded-full sm:size-28">
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
              <span className="text-muted-foreground truncate text-center text-sm transition group-hover:text-green-400">
                /
              </span>
              <span className="text-foreground max-w-full truncate text-center text-sm transition group-hover:text-green-400">
                @{follower.username}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {followersRes.data.length === 0 && (
        <div className="bg-muted flex flex-col items-center justify-center rounded-lg px-4 py-12">
          <Users className="text-muted-foreground mb-3 h-8 w-8" />
          <p className="text-muted-foreground text-sm">No followers yet</p>
        </div>
      )}
    </>
  );
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = createMetadata({
  title: "Github Followers",
  description: "Explore the Github followers of my projects.",
  image: assets.banner.ghFollowers.src,
  path: "gh-followers",
  keywords: ["github", "followers", "projects", "repositories"]
});
