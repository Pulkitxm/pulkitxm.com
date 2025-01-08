import Link from "next/link";
import { FaGithub, FaTag } from "react-icons/fa";
import { HiCalendar } from "react-icons/hi";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { PR } from "@/types/github";

export function PrListItem({ pr }: { pr: PR }) {
  return (
    <Link href={pr.url} target="_blank" passHref>
      <Card className="mb-2 transition-all duration-200 ease-in-out hover:shadow-md">
        <CardHeader className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="mb-2 text-base sm:mb-0">
              <p className="flex items-center gap-2 hover:underline">
                <FaGithub className="inline-block" />
                <span className="line-clamp-1">{pr.title}</span>
              </p>
            </CardTitle>
          </div>
          <CardDescription className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <span className="flex items-center gap-1">
              <HiCalendar className="inline-block" />
              Created: {formatDate(pr.created_at)}
            </span>
            {pr.state === "merged" && (
              <span className="flex items-center gap-1">
                <FaTag className="inline-block" />
                Merged: {formatDate(pr.merged_at)}
              </span>
            )}
            <div className="flex flex-wrap gap-1">
              {pr.labels.map((label, index) => (
                <Badge
                  variant="outline"
                  className="text-xs transition-colors duration-200 ease-in-out hover:bg-primary hover:text-primary-foreground"
                  key={index}
                >
                  {label}
                </Badge>
              ))}
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
