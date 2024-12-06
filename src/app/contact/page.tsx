"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { sendEmail } from "@/actions/email";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MessageSquare, Send, User, Calendar } from "lucide-react";
import Link from "next/link";
import { InlineWidget } from "react-calendly";
import profile, { links } from "@/data/profile";
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

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <Card className="overflow-hidden bg-black text-white">
        <CardHeader className="space-y-1 px-6 py-8">
          <CardTitle className="text-2xl font-bold sm:text-3xl">
            Get in Touch
          </CardTitle>
          <CardDescription className="text-gray-400">
            Have a question or want to work together? Choose an option below!
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
          <Tabs defaultValue="message" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="message"
                className="data-[state=active]:bg-white/10"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </TabsTrigger>
              <TabsTrigger
                value="schedule"
                className="data-[state=active]:bg-white/10"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Meeting
              </TabsTrigger>
            </TabsList>

            <TabsContent value="message" className="space-y-6">
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
                      id="email"
                      type="email"
                      value={formInputs.email}
                      onChange={(e) =>
                        setFormInputs((prev) => ({
                          ...prev,
                          email: e.target.value,
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
                      id="message"
                      value={formInputs.message}
                      onChange={(e) =>
                        setFormInputs((prev) => ({
                          ...prev,
                          message: e.target.value,
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
            </TabsContent>

            <TabsContent value="schedule" className="h-[600px]">
              <InlineWidget
                url={profile.calendlyUrl}
                styles={{
                  height: "100%",
                  width: "100%",
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-center bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4">
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
