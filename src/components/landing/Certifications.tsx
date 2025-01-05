"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import profile from "@/data/profile";

export default function Certifications() {
  return (
    <section className="mb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Certifications</h2>
        <p className="text-sm text-muted-foreground">I have completed the following certifications.</p>
      </div>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {profile.certifications.map((certification, index) => (
          <Link
            key={index}
            href={certification.verifyLink}
            className="group block"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card className="h-full overflow-hidden transition-colors hover:bg-muted/50">
              <CardHeader className="border-b p-0">
                <Image
                  src={certification.image}
                  width={800}
                  height={400}
                  alt={certification.name}
                  aria-label={certification.name}
                  className={`aspect-video w-full object-${certification.cover ? "cover" : "contain"}`}
                  unoptimized={!certification.optimize}
                />
              </CardHeader>
              <CardContent className="space-y-2 p-4">
                <h3 className="font-semibold">{certification.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Issued by:{" "}
                  <Link
                    href={certification.issuedBy.url}
                    className="underline-offset-4 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {certification.issuedBy.name}
                  </Link>
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <span className="flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 group-hover:underline">
                  Verify Certificate
                  <ExternalLink className="h-3 w-3" />
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
