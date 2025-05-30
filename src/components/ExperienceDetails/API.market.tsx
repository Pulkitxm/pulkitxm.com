import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

import assets from "@/assets";
import profile from "@/data/profile";
import { Experience } from "@/types/profile";

import ImageGallery from "../ImageGallery";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Quote } from "../ui/quote";

export default function APIMarketExperience({ exp }: { exp: Experience }) {
  const currentCompany = profile.experience.findIndex((e) => e.companyName === exp.companyName);
  const previousCompany = profile.experience[currentCompany + 1];

  return (
    <div className="flex flex-col gap-y-6">
      <h1 className="text-primary mb-4 text-lg font-bold md:text-xl lg:text-3xl">
        <span className="underline">{exp.position}</span>@
        <Link
          href={exp.url}
          className="hover:text-primary-dark transition-colors duration-200 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {exp.companyName}
        </Link>
      </h1>

      <div className="-mt-6">
        <p className="text-muted-foreground mb-6 text-lg">
          After my sudden departure from the{" "}
          <Link href={`/exp/${previousCompany.slug}`} className="underline">
            previous company
          </Link>
          , I was going through a rough patch. One of my most trusted mentors recommended me to{" "}
          <span className="underline">API.market</span>, and I couldn&apos;t be more grateful. The referral led me to a
          team I genuinely admire. The work, culture, and people here have been incredibly motivating and fulfilling. I
          had a lot of ownership of the platform. Things like revenue, databases etc. were shared transparently.
        </p>

        <div className="mb-8 overflow-hidden rounded-lg shadow-lg">
          <Link href={exp.url} target="_blank">
            <img
              src={assets.proffessionalThings.apiMarket.website.src}
              width={1200}
              height={800}
              alt="API.market"
              className="w-full object-cover object-center"
            />
          </Link>
        </div>
      </div>

      <div>
        <h3 className="text-primary mb-4 text-2xl font-bold sm:text-3xl">My Work</h3>
        <p className="mb-6 text-lg sm:text-xl">
          I have been working at a lot of tasks, but to mention some of the major changes to which I contributed:
        </p>
        <div className="space-y-8">
          {apiMarketExp.work.map((work, index) => (
            <div key={index} className="w-full rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <h4 className="text-primary mb-4 text-xl font-semibold">{work.heading}</h4>
              <div className="prose prose-sm w-full">{work.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-primary mb-4 text-2xl font-bold sm:text-3xl">Technologies I am using daily</h3>
        {apiMarketExp.skills.map((skill, index) => (
          <Badge variant="secondary" className="m-1 text-sm" key={index}>
            {skill}
          </Badge>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            Offer Letter
            <Link
              href={assets.proffessionalThings.apiMarket.apiMarketOfferLetter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open document"
            >
              <ExternalLink className="ml-2 h-5 w-5" />
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <iframe
            src={assets.proffessionalThings.apiMarket.apiMarketOfferLetter}
            title="Offer Letter"
            className="h-60 w-full rounded-md border-0 lg:h-96"
          />
        </CardContent>
      </Card>
    </div>
  );
}

const apiMarketExp = {
  skills: ["Nextjs (Pages Router)", "Next Auth (Auth.js)", "Stripe", "Tailwind CSS"],
  work: [
    {
      heading: "Code Clean up",
      description: (
        <>
          <p>
            After my onboarding my first task was to clean up the code with the best practice. The Co-founder mentioned
            this:
          </p>
          <Quote
            name="Shashank Aggarwal"
            designation="CEO & Founder of API.market"
            image={assets.proffessionalThings.apiMarket.shashank}
            className="my-4"
          >
            <b>Why is it so important to have good code and why are we focussing so much on code quality?</b>
            <br />
            It directly affects our revenue, operations and where we spend our time.
            <br />I can not emphasize enough on making sure our code works and works well. We are a tiny team handling
            over 3 Million API calls, we host and run over 40+ APIs and model in-house. How can we even do that?
            &quot;High Standard Code&quot;. All our APIs are used by a wide variety of users for all kinds of use-cases
            and across the globe.
            <b>Our code should just work, handle all errors, handle edge cases and other things</b>. We are training our
            users to expect &quot;Excellence&quot;, they should trust our code, our AI models, our systems. Trust is one
            of the biggest drivers of revenue. If we earn trust of our customers then they will reward us with their
            money and loyalty. That is our big differentiator. In the start, it&apos;s a bit annoying to see so many
            comments, fixes etc. But over time you get used to writing high quality clean code. I highly recommend
            reading the book
            <b>&quot;Clean Code&quot;</b>.
          </Quote>
          <p>
            So I fixed a lot of linting errors and code formatting using eslint and prettier. Added Nextjs-Typescript
            specific rules to imply stricter rules.
          </p>
        </>
      )
    },
    {
      heading: "Responsiveness for the platform over various devices",
      description: (
        <>
          <p>
            The mobile UI was not the most important thing we cared about as our customers were business people on
            desktops, but it had to be fixed. So I fixed and optimised the UI for mobile. Things like duplicate nav
            menus, I had to see and fix the components.
          </p>
          <div className="mt-4 h-auto w-full">
            <ImageGallery images={[assets.proffessionalThings.apiMarket.respComparison]} />
          </div>
        </>
      )
    },
    {
      heading: "Re-Designing Seller Dashboard for better managing APIs",
      description: (
        <>
          This re-design was majorly focussed to improve the usability of the seller Dashboard supported by API.market
          for the sellers to manage and visualize APIs and their revenues. In this work I improved the design of the
          dashboard using shadcn-ui and improved the responsiveness.
          <div className="mt-4 h-auto w-full">
            <ImageGallery images={[assets.proffessionalThings.apiMarket.sellerDash]} />
          </div>
        </>
      )
    },
    {
      heading: "Added Wallet system for users to add and store funds",
      description: (
        <>
          <div className="my-4 h-auto w-full">
            <ImageGallery images={[assets.proffessionalThings.apiMarket.wallet]} />
          </div>
          <p>
            This was done by keeping some future things in mind like wallets will be used to store credits provided to
            users, also we were planning to add. So in the old way of transactions on API.market users had to add their
            cards and the card marked as <b>default</b> would be used to make a transaction. But after the introduction
            of this wallet system users can add money via cards or we add credits in their account(to be implemented in
            fututre) and use them in any transaction on API.market platform like this -&gt;
          </p>
          <div className="my-4 h-auto w-full">
            <ImageGallery images={[assets.proffessionalThings.apiMarket.transactionPopup]} />
          </div>
        </>
      )
    }
  ]
};
