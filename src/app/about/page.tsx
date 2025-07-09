import Link from "next/link";

import assets from "@/assets";
import { HighlightComponent, Section } from "@/components/AboutCx";
import { PreviewLink } from "@/components/PreviewLink";
import YoutubeEmbed from "@/components/YoutubeEmbed";
import profile from "@/data/profile";
import { createMetadata } from "@/lib/utils";

import type { Metadata } from "next";

export default function About() {
  return (
    <>
      <header className="mb-10">
        <h1 className="text-4xl font-bold">About Me</h1>
      </header>

      <Section>
        Hi, I am Pulkit from India 🇮🇳. I love building stuff, and all my projects are hosted on
        <PreviewLink href={"https://github.com/" + profile.githubUserName}>GitHub</PreviewLink>. I began my journey back
        in 8th grade. We had basic HTML-CSS classes where we learned fundamental HTML rules, and I was amazed by the
        wonders of the web. I used to make my all of my firend&apos;s projects. Back then, I didn&apos;t had my personal
        laptop - we shared a basic
        <HighlightComponent>Dell laptop</HighlightComponent>
        between me, my mother (for her work), and my sister. We didn&apos;t even had WiFi back then, so I couldn&apos;t
        explore much. I didn&apos;t even knew that there existed such a big tech world in tech that have so many things
        to explore, I wish I had this exposure at that time. I focused more on academics, and things stayed pretty much
        the same until I finished school because of the og IIT/JEE rut. Anyways by the end of school time, I had a good
        knowledge of vanilla HTML and Python.
      </Section>
      <a></a>

      <Section>
        Then I entered the horrible world of engineering, I took admission in a decent college. That&apos;s when I
        started exploring how to get into tech. I saw people on YouTube shouting
        <HighlightComponent>Do DSA</HighlightComponent>, so like many others, I started with that. I bought the
        <PreviewLink href="https://www.apnacollege.in/">Alpha course from Apna College</PreviewLink> and spent 2-3
        months grinding through it. I didn&apos;t find much interest there, like you have to focus on boring concepts
        and just do this that number of leetcode questions. I was like, &quot;Is this all there is to tech?&quot;. I
        started exploring other options like web, app, cyber, you name it. Since I had some experience with web
        development, I decided to focus on that. Looking back, it was one of the best decisions I&apos;ve made.
      </Section>

      <Section>
        I got really interested in web development and started learning from free YouTube resources by amazing creators
        like<PreviewLink href="https://www.youtube.com/@CodeWithHarry">@CodeWithHarry</PreviewLink> and
        <PreviewLink href="https://www.youtube.com/@apnacollegeofficial">@ApnaCollegeOfficial</PreviewLink>. Wanting
        more structured guidance, I purchased another course from Apna College called
        <PreviewLink href="https://www.apnacollege.in/course/delta">Delta</PreviewLink>. I spent 4-6 months(around
        June-March 2023) learning from there. After completing it and learning how things work, I realized some concepts
        like
        <PreviewLink href="https://ejs.co/">ejs</PreviewLink> were getting outdated as tech keeps evolving and no one
        was talking about those concepts. So I kept exploring and building lots of projects to maintain a good grasp on
        concepts. If you see my contributions graph, you will see a lot of contributions in the second half of 2023.
        <Link
          href={
            "https://github.com/Pulkitxm?tab=overview&from=2023-12-01&to=2023-12-31#:~:text=contributions%20in%202023"
          }
          target="_blank"
        >
          <img src={assets.contributions2023.src} alt="contributions" className="my-4 rounded-md border-2" />
        </Link>
      </Section>

      <Section>
        It was around somewhere same in April 2023 when One of my mentors introduced me to
        <PreviewLink href="https://www.fullstackopen.com">fullstackopen.com</PreviewLink> - a turning point in my
        journey. This blog-based tutorial taught me great concepts from web to DevOps to testing and app development. I
        completed this course as well, but it was tough for me to complete this course as this was not some video
        tutorial but a reading based flow and it sucked at reading at that time. Big shoutout to one of the course
        creators,
        <PreviewLink href="https://github.com/mluukkai">Matti Luukkainen</PreviewLink>. You can find all my assignment
        solutions, certificates, and university credits at
        <PreviewLink href="https://github.com/Pulkitxm/fullstackopen">github.com/Pulkitxm/fullstackopen</PreviewLink>
        <Link href="https://github.com/Pulkitxm/fullstackopen" target="_blank">
          <img src={assets.fullstackopenRepo.src} alt="fullstackopen" className="mx-auto my-4 rounded-md border-2" />
        </Link>
      </Section>

      <Section>
        I discovered more awesome creators on YouTube like
        <PreviewLink href="https://www.youtube.com/@KevinPowell">@Kevin Powell</PreviewLink> and
        <PreviewLink href="@developedbyed">@developedbyed</PreviewLink>, improving my frontend skills while creating
        more projects. I started following{" "}
        <PreviewLink href="https://www.youtube.com/@harkirat1">@harkirat1</PreviewLink>,{" "}
        <PreviewLink href="https://www.youtube.com/@piyushgargdev">@piyushgargdev</PreviewLink>,{" "}
        <PreviewLink href="https://www.youtube.com/@HiteshCodeLab">@HiteshCodeLab</PreviewLink> and{" "}
        <PreviewLink href="https://www.youtube.com/@KunalKushwaha">@KunalKushwaha</PreviewLink>. I got most of my tech
        updates from them, I watched a lot project tutorials and ofcouse been through the
        <HighlightComponent>tutorial hell</HighlightComponent>. But somemhow managed to escape and continue working on
        my own skills
      </Section>

      <Section>
        Looking back, I&apos;d say consistency (never taking a break since day one in college) and building projects
        have been key to my progress. I kept my
        <PreviewLink href="https://www.linkedin.com/in/pulkitxm">LinkedIn</PreviewLink> updated throughout my journey
        and now ofcourse my <PreviewLink href={profile.links.x}>X</PreviewLink> account. I also did a 6 months long
        remote internship which I got just because of keeping my network updated with my work. I did some really cool
        work there. After that I took some break for my 5th semester improved my portfolio and github, If you&apos;d see
        my github contributions of 2024 that were quite improved as compared to 2023.
        <Link
          href="https://github.com/Pulkitxm?tab=overview&from=2024-12-01&to=2024-12-31#:~:text=contributions%20in%202024"
          target="_blank"
        >
          <img src={assets.contributions2024.src} alt="contributions" className="my-4 rounded-md border-2" />
        </Link>
      </Section>

      <Section>
        During my 5th Semester break, I approached <PreviewLink href="https://x.com/kirat_tw">Harkirat</PreviewLink> in
        one of his cohort classes regarding a referral with this{" "}
        <PreviewLink href="https://pulkitxm.notion.site/a1868e625280580f0bb0beff78863995e?pvs=74">
          notion doc
        </PreviewLink>{" "}
        and he loved my projects and profile so much that he followed me instantly during the class. He also praised me
        in another class. Here are the recordings of both instances
        <div className="flex flex-col gap-y-3">
          <YoutubeEmbed
            videoId="MqDhWAgNlpU"
            title="Cohort's Class in which I got the referral"
            className="my-4 h-[200px] w-full sm:h-[400px]"
          />
        </div>
        <div className="flex flex-col gap-y-3">
          <YoutubeEmbed
            videoId="tmITb7u662M"
            title="My Podcast with Harkirat Singh"
            className="my-4 h-[200px] w-full sm:h-[400px]"
          />
        </div>
      </Section>
    </>
  );
}

export const metadata: Metadata = createMetadata({
  title: "About Pulkit",
  description: "About Pulkit - Web Developer, Tech Enthusiast, and Blogger",
  image: assets.banner.about.src,
  path: "about",
  keywords: ["about", "pulkit", "web developer", "blogger", "tech enthusiast"]
});
