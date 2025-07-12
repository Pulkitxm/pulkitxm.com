import { notFound } from "next/navigation";
import React from "react";

import profile from "@/data/profile";

export default async function ExperienceDetailsPage({ params }: { params: Promise<{ expSlug: string }> }) {
  const { expSlug } = await params;

  const exp = profile.experience.find((exp) => exp.slug.includes(expSlug));

  if (!exp || !exp.expDetails) {
    return notFound();
  }

  const ExpDetails = exp.expDetails;

  return <ExpDetails exp={exp} />;
}
