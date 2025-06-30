import { NEXT_PUBLIC_API_URL } from "@/lib/constants";

import profile from "./profile";

export const generateRssFeed = () => {
  const feedUrl = `${NEXT_PUBLIC_API_URL}/api/feed`;

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title><![CDATA[${profile.name} - ${profile.caption}]]></title>
    <description><![CDATA[Personal website and blog of ${profile.name} - ${profile.caption}]]></description>
    <link>${NEXT_PUBLIC_API_URL}</link>
    <generator>RSS for Personal Portfolio</generator>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <copyright><![CDATA[Copyright ${new Date().getFullYear()}, ${profile.name}]]></copyright>
    <language><![CDATA[en-US]]></language>
    <managingEditor><![CDATA[${profile.contactEmail} (${profile.name})]]></managingEditor>
    <webMaster><![CDATA[${profile.contactEmail} (${profile.name})]]></webMaster>
    <ttl>60</ttl>

    <!-- Profile Information -->
    <item>
      <title><![CDATA[Profile Information]]></title>
      <description><![CDATA[
        Name: ${profile.name}
        Role: ${profile.caption}
        GitHub: ${profile.links.github}
        LinkedIn: ${profile.links.linkedin}
        Twitter: ${profile.links.x}
        Blog: ${profile.links.blogs}
        Discord: ${profile.links.discord}
        NPM: ${profile.links.npm}
        Resume: ${profile.resumeLink}
        Calendly: ${profile.calendlyUrl}
        Source Code: ${profile.sourceCodeUrl}
      ]]></description>
      <link>${NEXT_PUBLIC_API_URL}</link>
      <guid isPermaLink="true">${NEXT_PUBLIC_API_URL}/profile</guid>
      <dc:creator><![CDATA[${profile.name}]]></dc:creator>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>

    <!-- Projects -->
    ${profile.projects
      .map(
        (project) => `
    <item>
      <title><![CDATA[${project.name}]]></title>
      <description><![CDATA[${project.tagline}]]></description>
      <link>${project.url}</link>
      <guid isPermaLink="true">${project.url}</guid>
      <dc:creator><![CDATA[${profile.name}]]></dc:creator>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>`
      )
      .join("")}

    <!-- Experience -->
    ${profile.experience
      .map(
        (exp) => `
    <item>
      <title><![CDATA[${exp.position} at ${exp.companyName}]]></title>
      <description><![CDATA[
        Role: ${exp.position}
        Company: ${exp.companyName}
        Location: ${exp.location}
        Type: ${exp.roleType}
        Duration: ${exp.startDate.toLocaleDateString()} - ${exp.endDate ? exp.endDate.toLocaleDateString() : "Present"}
        Description: ${exp.desc}
      ]]></description>
      <link>${exp.url}</link>
      <guid isPermaLink="true">${exp.url}</guid>
      <dc:creator><![CDATA[${profile.name}]]></dc:creator>
      <pubDate>${exp.startDate.toUTCString()}</pubDate>
    </item>`
      )
      .join("")}

    <!-- Skills -->
    <item>
      <title><![CDATA[Skills]]></title>
      <description><![CDATA[
        ${Object.entries(profile.skills)
          .map(([category, skills]) => `${category}:\n${skills.join(", ")}`)
          .join("\n\n")}
      ]]></description>
      <link>${NEXT_PUBLIC_API_URL}/skills</link>
      <guid isPermaLink="true">${NEXT_PUBLIC_API_URL}/skills</guid>
      <dc:creator><![CDATA[${profile.name}]]></dc:creator>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>

    <!-- Events -->
    ${profile.events
      .map(
        (event) => `
    <item>
      <title><![CDATA[${event.name}]]></title>
      <description><![CDATA[${event.tagline}]]></description>
      <link>${event.link || NEXT_PUBLIC_API_URL}</link>
      <guid isPermaLink="true">${event.link || NEXT_PUBLIC_API_URL}</guid>
      <dc:creator><![CDATA[${profile.name}]]></dc:creator>
      <pubDate>${event.date.toUTCString()}</pubDate>
    </item>`
      )
      .join("")}

    <!-- Certifications -->
    ${profile.certifications
      .map(
        (cert) => `
    <item>
      <title><![CDATA[${cert.name}]]></title>
      <description><![CDATA[
        Issued By: ${cert.issuedBy.name}
        Issued At: ${cert.issuedAt.toLocaleDateString()}
        Verify: ${cert.verifyLink}
      ]]></description>
      <link>${cert.verifyLink}</link>
      <guid isPermaLink="true">${cert.verifyLink}</guid>
      <dc:creator><![CDATA[${profile.name}]]></dc:creator>
      <pubDate>${cert.issuedAt.toUTCString()}</pubDate>
    </item>`
      )
      .join("")}

    <!-- Design Projects -->
    ${profile.design.portfolioDesigns
      .map(
        (design) => `
    <item>
      <title><![CDATA[${design.title}]]></title>
      <description><![CDATA[
        Portfolio Design Project
        GitHub: ${design.githubLink}
      ]]></description>
      <link>${design.link}</link>
      <guid isPermaLink="true">${design.link}</guid>
      <dc:creator><![CDATA[${profile.name}]]></dc:creator>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>`
      )
      .join("")}

    ${profile.design.webDesigns
      .map(
        (design) => `
    <item>
      <title><![CDATA[${design.title}]]></title>
      <description><![CDATA[
        Web Design Project
        GitHub: ${design.githubLink}
      ]]></description>
      <link>${design.link}</link>
      <guid isPermaLink="true">${design.link}</guid>
      <dc:creator><![CDATA[${profile.name}]]></dc:creator>
      <pubDate>${new Date().toUTCString()}</pubDate>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return rssFeed;
};
