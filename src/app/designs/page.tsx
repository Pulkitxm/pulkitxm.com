"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { design } from "@/data/profile/design";
import { DesignItem } from "@/types/Experience";

export default function DesignsPage() {
  return (
    <div className="px-4 py-16">
      <motion.h1
        className="mb-16 text-center text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">Designs</span>
      </motion.h1>

      <section className="mb-32">
        <motion.h2
          className="mb-12 text-center text-2xl font-semibold sm:text-3xl md:text-4xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Web <span className="text-gray-500">Design Projects</span>
        </motion.h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:gap-12">
          {design.webDesigns.map((item, index) => (
            <DisplayWebDesign key={index} item={item} index={index} />
          ))}
        </div>
      </section>

      <section>
        <motion.h2
          className="mb-12 text-center text-2xl font-semibold sm:text-3xl md:text-4xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Portfolio <span className="text-gray-500">Evolution</span>
        </motion.h2>
        <div className="space-y-16 sm:space-y-24">
          {design.portfolioDesigns.map((item, index) => (
            <DisplayPortfolioDesign key={index} item={item} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}

function DisplayWebDesign({ item, index }: { item: DesignItem; index: number }) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative space-y-4 p-6">
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <Image
            src={item.image}
            width={500}
            height={500}
            objectFit="cover"
            alt={item.title}
            className="transition-transform duration-700 will-change-transform group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <h3 className="text-xl font-semibold text-white">{item.title}</h3>

        <div className="flex flex-wrap gap-4">
          <Link
            href={item.link}
            className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:shadow-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit Site
          </Link>
          <Link
            href={item.githubLink}
            className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:shadow-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function DisplayPortfolioDesign({ item, index }: { item: DesignItem; index: number }) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-900"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex flex-col gap-8 p-6 sm:p-8 md:flex-row md:items-center">
        <div className="flex-1 space-y-4">
          <h3 className="text-xl font-semibold text-white sm:text-2xl">{item.title}</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href={item.link}
              className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:shadow-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Site
            </Link>
            <Link
              href={item.githubLink}
              className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:shadow-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Link>
          </div>
        </div>
        <div className="relative aspect-video w-full overflow-hidden rounded-xl md:w-1/2 lg:w-2/5">
          <Image
            src={item.image}
            width={500}
            height={300}
            objectFit="cover"
            alt={item.title}
            className="transition-transform duration-700 will-change-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </div>
    </motion.div>
  );
}
