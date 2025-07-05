import { LiaLinkSolid } from "react-icons/lia";

import profile from "@/data/profile";

import { LinkComponent } from "../AboutCx";
import { PreFetchUrl } from "../PreFetchUrl";

export default function Aboutme() {
  return (
    <section className="mt-12 mb-6 rounded-xl">
      <h2 className="text-foreground mb-3 text-3xl font-bold tracking-tight">About me</h2>
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Hi, I am Pulkit from <strong>India</strong> 🇮🇳. I love building stuff, and all my projects are hosted on
          <LinkComponent href={"https://github.com/" + profile.githubUserName}>GitHub</LinkComponent>. My journey began
          in 8th grade with basic HTML-CSS, and since then, I&apos;ve evolved from a curious student to a web developer
          passionate about creating impactful solutions.
        </p>

        <p className="text-muted-foreground leading-relaxed">
          Through consistent learning and project building, I&apos;ve grown my skills across the full stack. Currently,
          I&apos;m working remotely with exciting technologies and always looking to learn more.
        </p>

        <PreFetchUrl
          href="/about"
          className="text-primary hover:text-primary/80 mt-2 inline-flex items-center font-medium transition-colors hover:underline"
        >
          Read more about my journey
          <LiaLinkSolid className="h-5 w-5" />
        </PreFetchUrl>
      </div>
    </section>
  );
}
