"use client";

import { Clock, Eye, ArrowUpRight, Calendar, ChevronDown, ChevronUp, ArrowUp, ArrowDown, Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useRef, useCallback } from "react";

import { getBlogs } from "@/actions/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LinkPreview } from "@/components/ui/link-preview";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import profile from "@/data/profile";
import { BlogType } from "@/types/blog";

type SortOption = "publishedAt" | "readTimeInMinutes" | "views";
type SortOrder = "asc" | "desc";

export default function BlogListing() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("publishedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [isTouchableDevice, setIsTouchableDevice] = useState(false);

  const fetchBlogs = useCallback(async () => {
    try {
      const blogz = await getBlogs();
      setBlogs(blogz);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }, []);

  const handleEnterControl = useCallback((e: KeyboardEvent) => {
    if (e.key === "/" && inputRef.current) {
      e.preventDefault();
      inputRef.current.focus();
    } else if (e.key === "Escape" && inputRef.current) {
      inputRef.current.blur();
    }
  }, []);

  const handleResize = useCallback(() => {
    setIsTouchableDevice("ontouchstart" in window);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleEnterControl);

    handleResize();
    fetchBlogs();
  }, [handleResize, handleEnterControl, fetchBlogs]);

  const filteredAndSortedBlogs = blogs
    .filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.brief.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.url.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "publishedAt") {
        return sortOrder === "asc"
          ? new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
          : new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      } else {
        return sortOrder === "asc" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
      }
    });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <main className="w-full max-w-4xl space-y-4 rounded-lg border-gray-700 p-4 sm:p-8 md:border">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Link
            href={profile.links.blogPageUrl}
            target="_blank"
            className="text-2xl font-bold underline sm:text-3xl md:text-4xl"
          >
            Blogs
          </Link>
          <Badge variant="secondary" className="text-sm">
            {filteredAndSortedBlogs.length}
          </Badge>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
            <Input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
              ref={inputRef}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-[140px] sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="bg-black" value="publishedAt">
                  Published Date
                </SelectItem>
                <SelectItem className="bg-black" value="readTimeInMinutes">
                  Read Time
                </SelectItem>
                <SelectItem className="bg-black" value="views">
                  Views
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSortOrder}
              aria-label={`Sort ${sortOrder === "asc" ? "ascending" : "descending"}`}
            >
              {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

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
        ) : filteredAndSortedBlogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs found.</p>
        ) : (
          filteredAndSortedBlogs.map((blog, index) => (
            <Blog key={index} blog={blog} isTouchableDevice={isTouchableDevice} />
          ))
        )}
      </div>
    </main>
  );
}

function Blog({ blog, isTouchableDevice }: { blog: BlogType; isTouchableDevice: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const briefRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setShowButton(contentRef.current.scrollHeight > 60);
    }
  }, [blog.brief]);

  const LinkComponent = isTouchableDevice ? "div" : LinkPreview;

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Link
              href={blog.url}
              target="_blank"
              className="block"
              rel="noopener noreferrer"
              aria-label={`Read ${blog.title}`}
            >
              <div className="flex items-start justify-between gap-4">
                <LinkComponent url={blog.coverImage} className="group flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-300 transition-colors group-hover:text-gray-400 sm:text-xl">
                    {blog.title}
                  </h2>
                </LinkComponent>
                <ArrowUpRight className="h-5 w-5 flex-shrink-0 text-gray-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </Link>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 sm:gap-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="whitespace-nowrap">{blog.readTimeInMinutes} min read</span>
              </div>

              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="whitespace-nowrap">{blog.views.toLocaleString()} views</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="whitespace-nowrap">
                  {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
                </span>
              </div>
            </div>

            <div
              ref={briefRef}
              className="relative overflow-hidden transition-all duration-500 ease-in-out"
              style={{
                maxHeight: expanded ? `${contentRef.current?.scrollHeight}px` : "60px"
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
