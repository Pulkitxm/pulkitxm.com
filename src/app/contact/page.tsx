"use client";

import { Mail, MessageSquare, Send, User, Calendar } from "lucide-react";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useState } from "react";

import { sendEmail } from "@/actions/email";
import Magnetic from "@/components/MagneticElement";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import profile, { links } from "@/data/profile";

export default function Component() {
  const [isSelected, setIsSelected] = useState<string>("message");
  const [formInputs, setFormInputs] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isTouchable, setIsTouchable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const Tabs = [
    {
      id: "message",
      label: "Send Message",
      icon: MessageSquare,
      content: (
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">
              Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                value={formInputs.name}
                onChange={(e) =>
                  setFormInputs((prev) => ({
                    ...prev,
                    name: e.target.value
                  }))
                }
                className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-400"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="email"
                value={formInputs.email}
                onChange={(e) =>
                  setFormInputs((prev) => ({
                    ...prev,
                    email: e.target.value
                  }))
                }
                className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-400"
                placeholder="john@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-300">
              Message
            </Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                value={formInputs.message}
                onChange={(e) =>
                  setFormInputs((prev) => ({
                    ...prev,
                    message: e.target.value
                  }))
                }
                className="min-h-[120px] border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-400"
                placeholder="Your message here..."
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-white/90"
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
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsTouchable("ontouchstart" in window);
  }, []);

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <Card className="overflow-hidden bg-black text-white">
        <CardHeader className="space-y-1 px-6 py-8">
          <CardTitle className="text-2xl font-bold sm:text-3xl">Get in Touch</CardTitle>
          <CardDescription className="text-gray-400">
            I’m always open to exploring new collaborations and exciting opportunities. Whether it’s a project idea, a
            job opportunity, or simply a chance to connect, feel free to reach out!
            <div className="mt-4 flex space-x-4">
              {links.map(({ href, icon: Icon, label }) => {
                const Element = isTouchable ? Fragment : Magnetic;
                return (
                  <Element key={label}>
                    <Link
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 transition-colors hover:text-white"
                    >
                      <Icon className="h-7 w-7" />
                      <span className="sr-only">{label}</span>
                    </Link>
                  </Element>
                );
              })}
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid h-9 w-full grid-cols-2 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
            {Tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  isSelected === id ? "bg-[#ffffff1a] text-white" : "text-muted-foreground"
                }`}
                onClick={() => setIsSelected(id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
          {Tabs.map(({ id, content }) => (
            <div key={id} className={`mt-6 ${isSelected === id ? "block" : "hidden"}`}>
              {content}
            </div>
          ))}
        </CardContent>

        <CardFooter className="flex items-center justify-center bg-gradient-to-r from-primary/5 to-primary/10 p-6 px-6 py-4">
          <p className="text-base sm:text-lg">
            or mail me at{" "}
            <Link
              href={`mailto:${profile.email}`}
              className="font-semibold text-primary underline-offset-4 transition-colors duration-200 hover:underline"
            >
              {profile.email}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
