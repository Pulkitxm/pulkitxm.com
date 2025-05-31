import { Clock, Eye, Calendar } from "lucide-react";
import Link from "next/link";

import { getBlogs } from "@/actions/blog";
import assets from "@/assets";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import profile from "@/data/profile";
import { createMetadata } from "@/lib/utils";
import { BlogType } from "@/types/blog";

import type { Metadata } from "next";

export default async function BlogListing() {
  const blogs = await getBlogs();
  const sortedBlogs = blogs.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return (
    <>
      <div className="mb-4 flex items-center space-x-2">
        <Link
          href={profile.links.blogPageUrl}
          target="_blank"
          className="text-2xl font-bold underline sm:text-3xl md:text-4xl"
        >
          Blogs ({profile.links.blogPageUrl.split("//")[1]})
        </Link>
        <Badge variant="secondary" className="text-sm">
          {sortedBlogs.length}
        </Badge>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {sortedBlogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs found.</p>
        ) : (
          sortedBlogs.map((blog, index) => <Blog key={index} blog={blog} />)
        )}
      </div>
    </>
  );
}

function Blog({ blog }: { blog: BlogType }) {
  return (
    <Card className="bg-background">
      <CardContent className="p-4 sm:p-6">
        <Link
          href={blog.url}
          target="_blank"
          className="block"
          rel="noopener noreferrer"
          aria-label={`Read ${blog.title}`}
        >
          <h2 className="mb-2 text-lg font-semibold text-gray-300 sm:text-xl">{blog.title}</h2>
        </Link>

        <div className="mb-2 flex flex-wrap items-center gap-3 text-sm text-gray-400 sm:gap-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{blog.readTimeInMinutes} min read</span>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{blog.views.toLocaleString()} views</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
              })}
            </span>
          </div>
        </div>

        <p className="text-gray-400">{blog.brief}</p>
      </CardContent>
    </Card>
  );
}

export const metadata: Metadata = createMetadata({
  title: "Blogs",
  description:
    "Explore Pulkit's blogs on web development, technology, and more. Dive into insightful articles and tutorials.",
  image: assets.banner.blogs.src,
  path: "blogs",
  keywords: ["Pulkit", "blogs", "web development", "technology", "tutorials", "articles"]
});
