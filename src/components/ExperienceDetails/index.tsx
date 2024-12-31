import Datawavelabs from "./Datawavelabs";
import GeeksForGeeks from "./GeeksForGeeks";

export default function ExperienceDetails({ expSlug }: { expSlug: string }) {
  const ExperienceDetailsComponent = experienceCx[expSlug];
  return <ExperienceDetailsComponent />;
}

const experienceCx: Record<string, React.FC> = {
  datawavelabs: Datawavelabs,
  geeksforgeeks: GeeksForGeeks,
  deviators: () => null
};
