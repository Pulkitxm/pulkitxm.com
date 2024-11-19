"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { sendEmail } from "@/actions/email";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Send, User } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import profile from "@/data/profile";
import Magnetic from "@/components/MagneticElement";

export default function Component() {
  const [formInputs, setFormInputs] = useState({
    name: "",
    email: "",
    message: "",
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
          sender_email: formInputs.email,
        });
        setIsSubmitted(true);
      } catch (error) {
        console.error("Failed to send email:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formInputs],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsTouchable("ontouchstart" in window);
  }, []);

  const links = [
    {
      href: profile.links.github,
      icon: FaGithub,
      label: "GitHub",
    },
    {
      href: profile.links.linkedin,
      icon: FaLinkedinIn,
      label: "LinkedIn",
    },
    {
      href: profile.links.twitter,
      icon: FaTwitter,
      label: "Twitter",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <Card className="overflow-hidden">
        <CardHeader className="space-y-1 bg-primary/5 px-6 py-8">
          <CardTitle className="text-2xl font-bold sm:text-3xl">
            Get in Touch
          </CardTitle>
          <CardDescription>
            Have a question or want to work together? Drop me a message!
            <div className="mt-4 flex space-x-4">
              {links.map(({ href, icon: Icon, label }) => {
                const Element = isTouchable ? Fragment : Magnetic;
                return (
                  <Element key={label}>
                    <Link
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-primary"
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

        <CardContent className="p-6">
          <form onSubmit={handleSendMessage} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    value={formInputs.name}
                    onChange={(e) =>
                      setFormInputs((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="pl-10"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formInputs.email}
                    onChange={(e) =>
                      setFormInputs((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="pl-10"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="message"
                    value={formInputs.message}
                    onChange={(e) =>
                      setFormInputs((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    className="min-h-[120px] pl-10"
                    placeholder="Your message here..."
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full sm:w-auto"
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
        </CardContent>
      </Card>
    </div>
  );
}
