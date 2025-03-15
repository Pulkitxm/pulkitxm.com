import { notFound } from "next/navigation";
import React from "react";

import profile from "@/data/profile";

export default function ExperienceDetailsPage({
  params
}: {
  params: {
    expSlug: string;
  };
}) {
  const { expSlug } = params;

  const exp = profile.experience.find((exp) => exp.slug === expSlug);

  if (!exp || !exp.expDetails) {
    return notFound();
  }

  const ExpDetails = exp.expDetails;

  return (
    <main className="mx-auto mt-2 w-full max-w-4xl space-y-4 rounded-lg border-gray-700 p-5 sm:space-y-6 sm:p-6 md:border">
      <ExpDetails exp={exp} />
    </main>
  );
}
