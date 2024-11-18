import ExperienceDetails from "@/components/ExperienceDetails";
import profile from "@/data/profile";
import { notFound } from "next/navigation";
import React from "react";

export default function ExperienceDetailsPage({
  params,
}: {
  params: {
    expSlug: string;
  };
}) {
  const { expSlug } = params;

  const isExperienceValid = profile.experience.some(
    (exp) => exp.slug === expSlug,
  );

  if (!isExperienceValid) {
    return notFound();
  }

  return (
    <div className="mx-auto mt-2 w-full max-w-4xl space-y-4 rounded-lg border-gray-700 p-5 sm:space-y-6 sm:p-6 md:border">
      <ExperienceDetails expSlug={expSlug} />
    </div>
  );
}
