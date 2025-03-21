import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import profile from "@/data/profile";
import { Certification } from "@/types/profile";

import JumpLink from "../JumpLink";

export default async function Certifications() {
  return (
    <section className="mb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Certifications</h2>
        <p className="text-sm text-muted-foreground">I have completed the following certifications.</p>
      </div>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {profile.certifications.map((certification, index) => (
          <Certificate key={index} certification={certification} />
        ))}
      </div>
    </section>
  );
}

function Certificate({ certification }: { certification: Certification }) {
  const key = "certification";

  return (
    <Link
      href={certification.verifyLink}
      className="group block"
      target="_blank"
      rel="noopener noreferrer"
      id={key + "-" + certification.slug}
    >
      <Card className="h-full overflow-hidden transition-colors hover:bg-muted/50">
        <CardHeader className="border-b p-0">
          <div className="relative h-48 w-full sm:h-56 md:h-64">
            <Image
              src={certification.image}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={certification.name}
              aria-label={certification.name}
              className={`object-${certification.cover ? "cover" : "contain"}`}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 p-4">
          <h3 className="font-semibold">{certification.name}</h3>
          <p className="text-sm text-muted-foreground">Issued at: {certification.issuedAt.toLocaleDateString()}</p>
          <p className="text-sm text-muted-foreground">
            Issued by:{" "}
            <Link
              href={certification.issuedBy.url}
              className="underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {certification.issuedBy.name}
            </Link>
          </p>
        </CardContent>
        <CardFooter className="flex justify-between p-4 pt-0">
          <span className="flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 group-hover:underline">
            Verify Certificate
            <ExternalLink className="h-3 w-3" />
          </span>
          <JumpLink
            path="/"
            url={{ key, id: certification.slug }}
            className={{
              master: "opacity-0 group-hover:opacity-100",
              child: "h-5 w-5 text-muted-foreground"
            }}
          />
        </CardFooter>
      </Card>
    </Link>
  );
}
