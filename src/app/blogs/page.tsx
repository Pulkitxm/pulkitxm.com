"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  Eye,
  ArrowUpRight,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { getBlogs } from "@/actions/blog";
import profile from "@/data/profile";
import { BlogType } from "@/types/blog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function BlogListing() {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const blogz = await getBlogs();
        setBlogs(blogz);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  return (
    <div className="mx-auto mt-2 w-full max-w-4xl space-y-4 rounded-lg border-gray-700 p-5 sm:space-y-6 sm:p-6 md:border">
      <Link
        href={profile.links.blogPageUrl}
        target="_blank"
        className="mb-4 text-2xl font-bold underline sm:mb-8 sm:text-3xl md:text-4xl"
      >
        Blogs
      </Link>

      <div className="grid gap-4 sm:gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-5 w-5" />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs found.</p>
        ) : (
          blogs.map((blog, index) => <Blog key={index} blog={blog} />)
        )}
      </div>
    </div>
  );
}

function Blog({ blog }: { blog: BlogType }) {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const briefRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setShowButton(contentRef.current.scrollHeight > 60);
    }
  }, [blog.brief]);

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Link href={blog.url} target="_blank" className="block">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold text-gray-300 transition-colors group-hover:text-gray-400 sm:text-xl">
                  {blog.title}
                </h2>
                <ArrowUpRight className="h-5 w-5 flex-shrink-0 text-gray-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </Link>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 sm:gap-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="whitespace-nowrap">
                  {blog.readTimeInMinutes} min read
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="whitespace-nowrap">
                  {blog.views.toLocaleString()} views
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="h-4 w-4" />
                <span className="whitespace-nowrap">
                  {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div
              ref={briefRef}
              className="relative overflow-hidden transition-all duration-500 ease-in-out"
              style={{
                maxHeight: expanded
                  ? `${contentRef.current?.scrollHeight}px`
                  : "60px",
              }}
            >
              <p ref={contentRef} className="text-gray-400">
                {blog.brief}
              </p>
              {!expanded && showButton && (
                <div className="absolute bottom-0 left-0 h-12 w-full bg-gradient-to-t from-background to-transparent" />
              )}
            </div>

            {showButton && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 flex items-center text-blue-400 transition-all duration-300 ease-in-out hover:text-blue-500 focus:text-blue-500"
                onClick={() => setExpanded(!expanded)}
              >
                <span>{expanded ? "Read less" : "Read more"}</span>
                {expanded ? (
                  <ChevronUp className="ml-1 h-4 w-4 transition-transform duration-300" />
                ) : (
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-300" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
