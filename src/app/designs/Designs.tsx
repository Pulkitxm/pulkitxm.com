"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

import { design } from "@/data/profile/design";
import { DesignItem } from "@/types/profile";

export default function Designs() {
  return (
    <>
      <motion.h1
        className="mb-16 text-center text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl dark:text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        My Designs
      </motion.h1>

      <section className="mb-32">
        <motion.h2
          className="text-muted-foreground mb-12 text-center text-2xl font-semibold sm:text-3xl md:text-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Web Design Projects
        </motion.h2>
        <motion.div
          className="grid gap-12 sm:grid-cols-1 lg:grid-cols-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {design.webDesigns.map((item, index) => (
            <DisplayWebDesign key={index} item={item} index={index} />
          ))}
        </motion.div>
      </section>

      <section>
        <motion.h2
          className="text-muted-foreground mb-12 text-center text-2xl font-semibold sm:text-3xl md:text-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Portfolio Evolution
        </motion.h2>
        <motion.div
          className="grid gap-12 sm:grid-cols-1 lg:grid-cols-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {design.portfolioDesigns.map((item, index) => (
            <DisplayPortfolioDesign key={index} item={item} index={index} />
          ))}
        </motion.div>
      </section>
    </>
  );
}

function DisplayWebDesign({ item, index }: { item: DesignItem; index: number }) {
  return (
    <motion.div
      className="group relative transform overflow-hidden rounded-2xl border border-gray-200 bg-white/80 shadow-xl backdrop-blur transition-all duration-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-900/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative">
        <div className="relative aspect-video overflow-hidden rounded-t-2xl">
          <img
            src={item.image.src}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-black/90 dark:via-black/60 dark:to-transparent" />
        </div>
        <div className="absolute right-0 bottom-0 left-0 flex translate-y-8 transform flex-col gap-2 p-6 text-gray-100 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 dark:text-white">
          <h3 className="mb-2 text-2xl font-bold drop-shadow-lg">{item.title}</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href={item.link}
              className="inline-flex items-center rounded-lg bg-green-600/90 px-4 py-2 text-sm font-medium text-white shadow transition-all duration-200 hover:scale-105 hover:bg-green-700/90 focus:ring-2 focus:ring-green-400 focus:outline-none"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Site
            </Link>
            <Link
              href={item.githubLink}
              className="inline-flex items-center rounded-lg bg-gray-700/90 px-4 py-2 text-sm font-medium text-white shadow transition-all duration-200 hover:scale-105 hover:bg-gray-800/90 focus:ring-2 focus:ring-gray-400 focus:outline-none"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DisplayPortfolioDesign({ item, index }: { item: DesignItem; index: number }) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white/80 shadow-xl backdrop-blur transition-all duration-300 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-900/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative aspect-4/3">
        <img
          src={item.image.src}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-black/90 dark:via-black/60 dark:to-transparent" />
        <div className="absolute inset-0 flex translate-y-8 transform flex-col justify-end gap-2 p-6 text-gray-100 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 dark:text-white">
          <h3 className="mb-2 text-2xl font-bold drop-shadow-lg">{item.title}</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href={item.link}
              className="inline-flex items-center rounded-lg bg-green-600/90 px-4 py-2 text-sm font-medium text-white shadow transition-all duration-200 hover:scale-105 hover:bg-green-700/90 focus:ring-2 focus:ring-green-400 focus:outline-none"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Site
            </Link>
            <Link
              href={item.githubLink}
              className="inline-flex items-center rounded-lg bg-gray-700/90 px-4 py-2 text-sm font-medium text-white shadow transition-all duration-200 hover:scale-105 hover:bg-gray-800/90 focus:ring-2 focus:ring-gray-400 focus:outline-none"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
