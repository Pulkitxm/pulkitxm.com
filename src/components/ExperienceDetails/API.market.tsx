"use client";

import { ExternalLink } from "lucide-react";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { Gallery, Item } from "react-photoswipe-gallery";

import assets from "@/assets";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote } from "@/components/ui/quote";
import profile from "@/data/profile";
import { getPreviousCompany } from "@/data/profile/experience";

import type { Experience } from "@/types/profile";

import "photoswipe/dist/photoswipe.css";

export default function APIMarketExperience({ exp }: { exp: Experience }) {
  const previousCompany = getPreviousCompany(exp.companyName);
  const allExperiences = profile.experience.filter((e) => e.companyName === exp.companyName);

  return (
    <Gallery>
      <div className="flex flex-col gap-y-8">
        <h1 className="text-primary text-2xl font-bold md:text-3xl lg:text-4xl">
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

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <h2 className="text-primary text-xl font-bold md:text-2xl">Timeline</h2>
            </AccordionTrigger>
            <AccordionContent>
              {allExperiences.map((experience, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 ${
                    index === allExperiences.length - 1 ? "rounded-b-lg" : ""
                  } border p-4`}
                >
                  <div className="bg-primary text-primary-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium">
                      {experience.position} ({experience.expType}):
                    </span>{" "}
                    <span className="text-muted-foreground">
                      {experience.startDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long"
                      })}{" "}
                      -{" "}
                      {experience.endDate?.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long"
                      }) || "Present"}
                    </span>
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div>
          <p className="text-muted-foreground text-base leading-relaxed">
            After my sudden departure from the{" "}
            <Link href={`/exp/${previousCompany?.slug}`} className="underline">
              previous company
            </Link>
            , I was going through a rough patch. One of my most trusted mentors recommended me to{" "}
            <span className="underline">API.market</span>, and I couldn&apos;t be more grateful. The referral led me to
            a team I genuinely admire. The work, culture, and people here have been incredibly motivating and
            fulfilling. I had a lot of ownership of the platform. Things like revenue, databases etc. were shared
            transparently.
          </p>

          <div className="mt-6 mb-8 overflow-hidden rounded-lg shadow-lg">
            <ImageItem images={[assets.proffessionalThings.apiMarket.website]} />
          </div>
        </div>

        <div>
          <h2 className="text-primary mb-4 text-xl font-bold md:text-2xl">My Work</h2>

          <p className="mb-6 text-base leading-relaxed">
            I have been working at a lot of tasks, but to mention some of the major changes to which I contributed:
          </p>

          <div className="space-y-6">
            {apiMarketExp.work.map((work, index) => (
              <div key={index} className="w-full rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <h3 className="text-primary mb-4 text-lg font-semibold">{work.heading}</h3>
                <div className="prose prose-sm w-full text-base">{work.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-primary mb-4 text-xl font-bold md:text-2xl">Technologies I am using daily</h2>
          <div className="flex flex-wrap gap-2">
            {apiMarketExp.skills.map((skill, index) => (
              <Badge variant="secondary" className="text-sm" key={index}>
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-semibold">
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
    </Gallery>
  );
}

const apiMarketExp = {
  skills: ["Nextjs (Pages Router)", "Next Auth (Auth.js)", "Stripe", "Tailwind CSS", "Elasticsearch", "PostgreSQL"],
  work: [
    {
      heading: "Code Clean up",
      description: (
        <>
          <p className="mb-4 text-base">
            After my onboarding my first task was to clean up the code with the best practice. The Co-founder mentioned
            this:
          </p>
          <Quote
            name="Shashank Aggarwal"
            designation="CEO & Founder of API.market"
            image={assets.proffessionalThings.apiMarket.shashank}
            className="my-4"
          >
            <span className="text-base">
              <b>Why is it so important to have good code and why are we focussing so much on code quality?</b>
              <br />
              It directly affects our revenue, operations and where we spend our time.
              <br />I can not emphasize enough on making sure our code works and works well. We are a tiny team handling
              over 3 Million API calls, we host and run over 40+ APIs and model in-house. How can we even do that?
              &quot;High Standard Code&quot;. All our APIs are used by a wide variety of users for all kinds of
              use-cases and across the globe.
              <b>Our code should just work, handle all errors, handle edge cases and other things</b>. We are training
              our users to expect &quot;Excellence&quot;, they should trust our code, our AI models, our systems. Trust
              is one of the biggest drivers of revenue. If we earn trust of our customers then they will reward us with
              their money and loyalty. That is our big differentiator. In the start, it&apos;s a bit annoying to see so
              many comments, fixes etc. But over time you get used to writing high quality clean code. I highly
              recommend reading the book <b>&quot;Clean Code&quot;</b>.
            </span>
          </Quote>
          <p className="text-base">
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
          <p className="mb-4 text-base">
            The mobile UI was not the most important thing we cared about as our customers were business people on
            desktops, but it had to be fixed. So I fixed and optimised the UI for mobile. Things like duplicate nav
            menus, I had to see and fix the components.
          </p>
          <div className="mt-4 h-auto w-full">
            <ImageItem images={[assets.proffessionalThings.apiMarket.respComparison]} />
          </div>
        </>
      )
    },
    {
      heading: "Re-Designing Seller Dashboard for better managing APIs",
      description: (
        <>
          <p className="mb-4 text-base">
            This re-design was majorly focussed to improve the usability of the seller Dashboard supported by API.market
            for the sellers to manage and visualize APIs and their revenues. In this work I improved the design of the
            dashboard using shadcn-ui and improved the responsiveness.
          </p>
          <div className="mt-4 h-auto w-full">
            <ImageItem images={[assets.proffessionalThings.apiMarket.sellerDash]} />
          </div>
        </>
      )
    },
    {
      heading: "Added Wallet system for users to add and store funds",
      description: (
        <>
          <div className="my-4 h-auto w-full">
            <ImageItem images={[assets.proffessionalThings.apiMarket.wallet]} />
          </div>
          <p className="mb-4 text-base">
            This was done by keeping some future things in mind like wallets will be used to store credits provided to
            users, also we were planning to add. So in the old way of transactions on API.market users had to add their
            cards and the card marked as <b>default</b> would be used to make a transaction. But after the introduction
            of this wallet system users can add money via cards or we add credits in their account(to be implemented in
            future) and use them in any transaction on API.market platform like this:
          </p>
          <div className="my-4 h-auto w-full">
            <ImageItem images={[assets.proffessionalThings.apiMarket.transactionPopup]} />
          </div>
        </>
      )
    },
    {
      heading: "Adding Vouchers for users to redeem Credits in Wallet",
      description: (
        <>
          <p className="mb-4 text-base">
            During our product launch, we had a plan to give 100 vouchers worth $5 each to all the production people who
            came to our website. Additionally, when we had a
            <Link href={"https://devolympus.deviatorsdce.tech"} target="_blank" className="mx-0.5 underline">
              hackathon on our campus
            </Link>
            , we wanted to provide vouchers for participants. With these requirements in mind, we developed a
            comprehensive voucher system where users could claim public vouchers and the money would be credited into
            their wallet, which they could then utilize on the platform.
          </p>
          <div className="my-4 h-auto w-full">
            <ImageItem images={[assets.proffessionalThings.apiMarket.voucher]} />
          </div>
          <div className="mb-4 w-full text-base">
            We implemented two distinct types of vouchers to meet different use cases. The first type was a targeted
            voucher system where we could could claim the voucher by mentioning specific email addresses. This allowed
            for precise control over voucher distribution for specific events or user groups. The second type was a
            where people could freely claim it once per account, with a maximum limit of 100 people. This system
            provided provided flexibility for both controlled distribution and open public access while maintaining
            security and preventing abuse.
            <div className="my-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
              <ImageItem
                images={[assets.proffessionalThings.apiMarket.vouchers.targeted]}
                className="max-h-[200px] md:max-h-none"
              />
              <ImageItem
                images={[assets.proffessionalThings.apiMarket.vouchers.public]}
                className="max-h-[200px] md:max-h-none"
              />
            </div>
          </div>
        </>
      )
    },
    {
      heading: "New Hero Section Design",
      description: (
        <div>
          <p className="mb-4 text-base">
            I redesigned the hero section of the API.market website to enhance user engagement and provide clearer
            information hierarchy. The new design featured improved visual flow, better call-to-action placement, and
            more intuitive navigation elements.
          </p>
          <video src={assets.proffessionalThings.apiMarket.newHeroSection} autoPlay muted loop controls />
        </div>
      )
    }
  ]
};

function ImageItem({ images, className }: { images: StaticImageData[]; className?: string }) {
  return (
    <Item thumbnail={images[0].src} original={images[0].src} width={images[0].width} height={images[0].height}>
      {({ ref, open }) => (
        <img
          src={images[0].src}
          alt={"Gallery Image"}
          ref={ref}
          onClick={open}
          className={`size-full cursor-pointer rounded-lg border object-cover object-left-top ${className}`}
        />
      )}
    </Item>
  );
}
