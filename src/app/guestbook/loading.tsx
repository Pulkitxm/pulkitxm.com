import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-gradient-to-b from-background to-background/80 p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <Card className="space-y-6 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-8 text-center">
          <div className="space-y-4">
            <Skeleton className="mx-auto h-8 w-3/4" />
            <Skeleton className="mx-auto h-5 w-2/3" />
          </div>
          <Skeleton className="mx-auto h-10 w-48" />
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>

          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
