import profile from "@/data/profile";
import GitHubCalendar from "react-github-calendar";

export default function GithubGraph() {
  return (
    <div className="my-5">
      <GitHubCalendar
        username={profile.githubUserName}
        colorScheme="dark"
        hideColorLegend={true}
        hideTotalCount={true}
      />
    </div>
  );
}
