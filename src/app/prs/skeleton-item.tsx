import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonItem() {
  return (
    <Card className="mb-2 transition-all duration-200 ease-in-out hover:shadow-md">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export function SkeletonFilter() {
  return (
    <div className="mb-6 flex animate-pulse flex-col gap-4 sm:flex-row">
      <div className="relative flex-grow">
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex flex-wrap gap-2 sm:flex-nowrap">
        <Skeleton className="h-10 w-[150px]" />
        <Skeleton className="h-10 w-[150px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
    </div>
  );
}
