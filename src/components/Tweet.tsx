"use client";

import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Bookmark } from "lucide-react";
import Link from "next/link";
import { memo, useCallback } from "react";

import { Button } from "@/components/ui/button";
import profile from "@/data/profile";
import { cn } from "@/lib/utils";

import { Card } from "./ui/card";

import type React from "react";

interface TweetUser {
  name: string;
  username: string;
  pfp?: string;
  profileLink: string;
  verified?: boolean;
}

type Action = "like" | "comment" | "retweet" | "bookmark" | "share" | "more";

interface TweetProps {
  likes: number | string;
  bookmarks: number | string;
  comments: number | string;
  retweets: number | string;
  timestamp: string;
  views: number | string;
  content: string;
  link: string;
  user: TweetUser;
}

const VerifiedIcon = memo(() => (
  <svg
    className="h-4 w-4 flex-shrink-0 text-blue-500"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-label="Verified account"
  >
    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
  </svg>
));

VerifiedIcon.displayName = "VerifiedIcon";

const UserInfo = memo(({ user }: { user: TweetUser }) => (
  <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:gap-3">
    <Link
      href={user.profileLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
      onClick={(e) => e.stopPropagation()}
      aria-label={`View ${user.name}'s profile`}
    >
      <img
        src={user.pfp || profile.x.pfp}
        alt=""
        width={40}
        height={40}
        className="rounded-full object-cover sm:h-12 sm:w-12"
        loading="lazy"
      />
    </Link>
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
        <h3 className="truncate text-base font-semibold sm:text-lg sm:font-bold dark:text-neutral-100">{user.name}</h3>
        {user.verified && <VerifiedIcon />}
      </div>
      <Link
        href={user.profileLink}
        target="_blank"
        rel="noopener noreferrer"
        className="truncate text-sm transition-colors hover:text-neutral-700 focus:text-neutral-700 focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-300 dark:focus:text-neutral-300"
        onClick={(e) => e.stopPropagation()}
      >
        @{user.username}
      </Link>
    </div>
  </div>
));

UserInfo.displayName = "UserInfo";

const ActionButton = memo(
  ({
    icon: Icon,
    count,
    hoverColor,
    action,
    ariaLabel,
    onInteraction
  }: {
    icon: React.ElementType;
    count: number | string;
    hoverColor: string;
    action: string;
    ariaLabel: string;
    onInteraction?: (action: Action) => void;
  }) => {
    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onInteraction?.(action as Action);
      },
      [action, onInteraction]
    );

    const displayCount = typeof count === "number" ? (count > 0 ? count : null) : count;

    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "group/btn flex cursor-pointer items-center gap-1.5 rounded p-0 transition-all duration-200 hover:bg-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-neutral-400 dark:hover:bg-neutral-800",
          hoverColor
        )}
        onClick={handleClick}
        aria-label={ariaLabel}
      >
        <Icon className="h-4 w-4 transition-transform duration-200 sm:h-5 sm:w-5" />
        {displayCount && <span className="text-xs tabular-nums sm:text-sm">{displayCount}</span>}
      </Button>
    );
  }
);

ActionButton.displayName = "ActionButton";

export const Tweet = memo(
  ({ content, link, user, timestamp, views, likes = 0, comments = 0, retweets = 0, bookmarks = 0 }: TweetProps) => {
    const handleMoreClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
    }, []);

    const handleShareClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
    }, []);

    return (
      <Link href={link} target="_blank" rel="noopener noreferrer" className="block rounded-lg focus:outline-none">
        <Card
          className={cn(
            "group relative mx-auto w-full max-w-2xl cursor-pointer border-2 bg-white p-4 text-neutral-900 shadow-lg transition-all duration-200 hover:bg-neutral-50 hover:shadow-xl sm:p-6 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900/50"
          )}
        >
          <header className="mb-3 flex items-start justify-between gap-2 sm:gap-4">
            <UserInfo user={user} />

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 flex-shrink-0 cursor-pointer rounded transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:h-8 sm:w-8 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              onClick={handleMoreClick}
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </header>

          <div className="mb-3 text-base leading-relaxed break-words whitespace-pre-line sm:mb-4 sm:text-lg dark:text-neutral-100">
            {content}
          </div>
          {(timestamp || views) && (
            <div className="mb-4 flex flex-wrap items-center gap-1 text-xs sm:mb-5 sm:text-sm dark:text-neutral-400">
              {timestamp && <time>{timestamp}</time>}
              {views && (
                <>
                  <span aria-hidden="true"> · </span>
                  <span className="font-semibold tabular-nums dark:text-neutral-100">{views}</span>
                  <span> Views</span>
                </>
              )}
            </div>
          )}

          <footer className="border-t pt-3 sm:pt-4 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <nav className="flex items-center gap-4 sm:gap-8" aria-label="Tweet actions">
                <ActionButton
                  icon={MessageCircle}
                  count={comments}
                  hoverColor="hover:text-blue-500 dark:hover:text-blue-400 focus:text-blue-500 dark:focus:text-blue-400"
                  action="comment"
                  ariaLabel={`Reply. ${comments} replies`}
                />

                <ActionButton
                  icon={Repeat2}
                  count={retweets}
                  hoverColor="hover:text-green-600 dark:hover:text-green-400 focus:text-green-600 dark:focus:text-green-400"
                  action="retweet"
                  ariaLabel={`Retweet. ${retweets} retweets`}
                />

                <ActionButton
                  icon={Heart}
                  count={likes}
                  hoverColor="hover:text-red-500 dark:hover:text-red-400 focus:text-red-500 dark:focus:text-red-400"
                  action="like"
                  ariaLabel={`Like. ${likes} likes`}
                />

                <ActionButton
                  icon={Bookmark}
                  count={bookmarks}
                  hoverColor="hover:text-blue-500 dark:hover:text-blue-400 focus:text-blue-500 dark:focus:text-blue-400"
                  action="bookmark"
                  ariaLabel={`Bookmark. ${bookmarks} bookmarks`}
                />
              </nav>

              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer rounded p-0 transition-all duration-200 hover:text-blue-500 focus:text-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-neutral-400 dark:hover:text-blue-400 dark:focus:text-blue-400"
                onClick={handleShareClick}
                aria-label="Share tweet"
              >
                <Share className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </footer>
        </Card>
      </Link>
    );
  }
);

Tweet.displayName = "Tweet";
