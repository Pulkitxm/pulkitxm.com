import Datawavelabs from "./Datawavelabs";

export default function ExperienceDetails({ expSlug }: { expSlug: string }) {
  const ExperienceDetailsComponent = experienceCx[expSlug];
  return <ExperienceDetailsComponent />;
}

const experienceCx: Record<string, React.FC> = {
  datawavelabs: Datawavelabs,
};
