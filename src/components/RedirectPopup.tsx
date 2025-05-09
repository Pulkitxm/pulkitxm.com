"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import { NEXT_PUBLIC_API_URL } from "@/lib/constants";

export default function RedirectPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const referrer = document.referrer;
    const isPreviousDomain = referrer.includes("devpulkit.in") || referrer.includes("www.devpulkit.in");

    const urlParams = new URLSearchParams(window.location.search);
    const fromRedirect = urlParams.get("from") === "devpulkit.in";

    if (fromRedirect || isPreviousDomain) {
      setIsVisible(true);
    }
  }, []);

  const closePopup = () => setIsVisible(false);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="bg-opacity-80 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePopup}
        >
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-lg border border-[#1e1e1e] bg-[#0e0e0e] p-6 shadow-xl"
            initial={{ scale: 0.5, y: 100 }}
            animate={{
              scale: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 10,
                bounce: 0.8
              }
            }}
            exit={{
              scale: 0.5,
              y: 100,
              transition: {
                duration: 0.3
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="absolute top-2 right-2"
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <button
                className="rounded-full border border-[#1e1e1e] bg-[#0e0e0e] p-1 text-gray-400 transition-colors hover:text-[#2ecc71]"
                onClick={closePopup}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 300,
                damping: 15
              }}
            >
              <motion.h2
                className="mb-4 text-2xl font-bold text-[#2ecc71]"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  delay: 0.3
                }}
              >
                Welcome to My New Domain
              </motion.h2>

              <motion.div
                className="mb-4 text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                My portfolio has moved from <span className="font-mono line-through opacity-70">devpulkit.in</span> to{" "}
                <motion.span
                  className="font-mono font-semibold text-[#2ecc71]"
                  animate={{
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    repeat: 2,
                    repeatType: "reverse",
                    duration: 1,
                    delay: 0.6
                  }}
                >
                  {NEXT_PUBLIC_API_URL.replace("https://", "").replace("http://", "").replace("www.", "")}
                </motion.span>
              </motion.div>

              <motion.p
                className="mb-6 text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Thank you for visiting my portfolio. Please update your bookmarks to stay connected with my latest
                projects and contributions.
              </motion.p>

              <motion.div
                className="flex justify-end"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  delay: 0.7
                }}
              >
                <motion.button
                  className="rounded-md border border-[#2ecc71] bg-[#121212] px-4 py-2 text-[#2ecc71] transition-colors hover:bg-[#2ecc71] hover:text-[#121212]"
                  onClick={closePopup}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 10
                  }}
                >
                  Continue to Portfolio
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
