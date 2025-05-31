import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import profile from "@/data/profile";

export default function Loading() {
  return (
    <>
      <div className="mb-4 flex items-center space-x-2">
        <a
          href={profile.links.blogPageUrl}
          target="_blank"
          className="text-2xl font-bold underline sm:text-3xl md:text-4xl"
        >
          Blogs ({profile.links.blogPageUrl.split("//")[1]})
        </a>
        <Badge variant="secondary" className="text-sm">
          <Skeleton className="h-4 w-8" />
        </Badge>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="bg-background">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex flex-wrap items-center gap-3 text-sm sm:gap-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
