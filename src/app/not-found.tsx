"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Frown } from "lucide-react";

import { PreFetchUrl } from "@/components/PreFetchUrl";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="bg-background flex min-h-[70svh] items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
          className="inline-block"
        >
          <Frown className="text-muted-foreground mx-auto h-24 w-24" />
        </motion.div>
        <h1 className="text-foreground text-4xl font-bold">404</h1>
        <p className="text-muted-foreground text-xl">Oops! Page not found</p>
        <p className="text-muted-foreground mx-auto max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button asChild className="mt-4">
            <PreFetchUrl href="/" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </PreFetchUrl>
          </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}
