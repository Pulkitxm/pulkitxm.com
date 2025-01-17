"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { design } from "@/data/profile/design";
import { DesignItem } from "@/types/profile";

export default function DesignsPage() {
  return (
    <div className="px-4 py-16">
      <motion.h1
        className="mb-16 text-center text-4xl font-bold dark:text-white sm:text-5xl md:text-6xl lg:text-7xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        My <span className="inline-block text-blue-400 transition-transform duration-300 hover:scale-110">Designs</span>
      </motion.h1>

      <section className="mb-32">
        <motion.h2
          className="mb-12 text-center text-2xl font-semibold dark:text-gray-200 sm:text-3xl md:text-4xl"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Web <span className="dark:text-gray-400">Design Projects</span>
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
          className="mb-12 text-center text-2xl font-semibold dark:text-gray-200 sm:text-3xl md:text-4xl"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Portfolio <span className="dark:text-gray-400">Evolution</span>
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
    </div>
  );
}

function DisplayWebDesign({ item, index }: { item: DesignItem; index: number }) {
  return (
    <motion.div
      className="group relative transform overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative">
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
          <Image
            src={item.image}
            fill
            objectFit="cover"
            alt={item.title}
            className="transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 translate-y-full transform p-6 text-white transition-transform duration-300 group-hover:translate-y-0">
          <h3 className="mb-2 text-2xl font-bold">{item.title}</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href={item.link}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Site
            </Link>
            <Link
              href={item.githubLink}
              className="inline-flex items-center rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-gray-600"
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
      className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-gray-800"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={item.image}
          layout="fill"
          objectFit="cover"
          alt={item.title}
          className="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <h3 className="mb-2 text-2xl font-bold">{item.title}</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href={item.link}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Site
            </Link>
            <Link
              href={item.githubLink}
              className="inline-flex items-center rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-gray-600"
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
