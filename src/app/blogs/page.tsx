import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Eye, ArrowUpRight, Calendar } from "lucide-react";
import Link from "next/link";
import { getBlogs } from "@/actions/blog";

export default async function BlogListing() {
  const { blogs } = await getBlogs();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 p-4 sm:space-y-6 sm:p-6">
      <h1 className="mb-4 text-2xl font-bold sm:mb-8 sm:text-3xl md:text-4xl">
        Latest Blogs
      </h1>

      <div className="grid gap-4 sm:gap-6">
        {blogs.map((blog, index) => (
          <Link href={blog.url} key={index} target="_blank" className="block">
            <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-lg font-semibold text-gray-300 transition-colors group-hover:text-gray-400 sm:text-xl">
                        {blog.title}
                      </h2>
                      <ArrowUpRight className="h-5 w-5 flex-shrink-0 text-gray-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </div>

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
                          {new Date(blog.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
