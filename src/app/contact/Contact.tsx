"use client";

import { Mail, MessageSquare, Send, User, Calendar } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";

import { sendEmail } from "@/actions/email";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import profile, { links } from "@/data/profile";

export default function Contact() {
  const [isSelected, setIsSelected] = useState<string>("message");
  const [formInputs, setFormInputs] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [sliderStyle, setSliderStyle] = useState({
    width: "50%",
    transform: "translateX(0%)"
  });

  const handleSendMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formInputs.name || !formInputs.email || !formInputs.message) return;

      setIsSubmitting(true);

      try {
        await sendEmail({
          from_name: formInputs.name,
          message: formInputs.message,
          sender_email: formInputs.email
        });
        setIsSubmitted(true);
      } catch (error) {
        console.error("Failed to send email:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formInputs]
  );

  const Tabs = useMemo(
    () => [
      {
        id: "message",
        label: "Send Message",
        icon: MessageSquare,
        content: (
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Name
              </Label>
              <div className="relative">
                <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="text"
                  value={formInputs.name}
                  onChange={(e) =>
                    setFormInputs((prev) => ({
                      ...prev,
                      name: e.target.value
                    }))
                  }
                  className="border-border bg-background/50 text-foreground placeholder:text-muted-foreground pl-10"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="email"
                  value={formInputs.email}
                  onChange={(e) =>
                    setFormInputs((prev) => ({
                      ...prev,
                      email: e.target.value
                    }))
                  }
                  className="border-border bg-background/50 text-foreground placeholder:text-muted-foreground pl-10"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-foreground">
                Message
              </Label>
              <div className="relative">
                <MessageSquare className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <Textarea
                  value={formInputs.message}
                  onChange={(e) =>
                    setFormInputs((prev) => ({
                      ...prev,
                      message: e.target.value
                    }))
                  }
                  className="border-border bg-background/50 text-foreground placeholder:text-muted-foreground min-h-[120px] pl-10"
                  placeholder="Your message here..."
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
              disabled={isSubmitting || isSubmitted}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  Sending...
                  <span className="animate-spin">⏳</span>
                </span>
              ) : isSubmitted ? (
                <span className="flex items-center gap-2">
                  Thanks
                  <span className="animate-pulse">✨</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Send Message
                  <Send className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        )
      },
      {
        id: "schedule",
        label: "Schedule Meeting",
        icon: Calendar,
        content: (
          <iframe
            title="Calendly Scheduling Page"
            src="https://cal.com/pulkitxm?embed_type=Inline&amp;embed_domain=1"
            style={{
              height: "450px",
              width: "100%"
            }}
          />
        )
      }
    ],
    [formInputs.email, formInputs.message, formInputs.name, handleSendMessage, isSubmitted, isSubmitting]
  );

  useEffect(() => {
    const index = Tabs.findIndex((tab) => tab.id === isSelected);
    const transformValue = index * 100;

    setSliderStyle({
      width: "50%",
      transform: `translateX(${transformValue}%)`
    });
  }, [Tabs, isSelected]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const query = new URLSearchParams(window.location.search);
    const isScheduled = query.get("schedule");
    if (isScheduled !== null) {
      setIsSelected("schedule");
    }
  }, []);

  return (
    <Card className="border-border text-card-foreground overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader className="space-y-1 px-6 py-8">
        <CardTitle className="text-2xl font-bold sm:text-3xl">Get in Touch</CardTitle>
        <CardDescription className="text-muted-foreground">
          I&apos;m always open to exploring new collaborations and exciting opportunities. Whether it&apos;s a project
          idea, a job opportunity, or simply a chance to connect, feel free to reach out!
          <div className="mt-4 flex space-x-4">
            {links.map(({ href, icon: Icon, label }, index) => {
              return (
                <Link
                  key={`${label}-${index}`}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  <Icon className="h-7 w-7" />
                  <span className="sr-only">{label}</span>
                </Link>
              );
            })}
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div
          className="bg-muted text-muted-foreground relative grid h-9 w-full grid-cols-2 items-center justify-center rounded-lg p-1"
          ref={tabsRef}
        >
          <div
            className="bg-primary/20 absolute top-1 bottom-1 rounded-md transition-all duration-300 ease-in-out"
            style={sliderStyle}
          ></div>

          {Tabs.map(({ id, label, icon: Icon }, index) => (
            <button
              key={`${id}-${index}`}
              type="button"
              className={`ring-offset-background focus-visible:ring-ring z-10 inline-flex cursor-pointer items-center justify-center rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
                isSelected === id ? "text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setIsSelected(id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
        {Tabs.map(({ id, content }, index) => (
          <div key={`${id}-${index}`} className={`mt-6 ${isSelected === id ? "block" : "hidden"}`}>
            {content}
          </div>
        ))}
      </CardContent>

      <CardFooter className="from-primary/5 to-primary/10 flex items-center justify-center bg-gradient-to-r p-6 px-6 py-4">
        <p className="text-base sm:text-lg">
          or mail me at{" "}
          <Link
            href={`mailto:${profile.contactEmail}`}
            className="text-primary font-semibold underline-offset-4 transition-colors duration-200 hover:underline"
          >
            {profile.contactEmail}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
