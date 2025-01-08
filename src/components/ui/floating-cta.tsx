"use client";

import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { FEATURE_FLAGS } from "@/lib/config";

import { PreFetchUrl } from "../PreFetchUrl";

export default function CollabInviteLayer() {
  if (FEATURE_FLAGS.FLOATING_CTA) return <CollabInviteLayerCX />;
}

function CollabInviteLayerCX() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 1000);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          className="sticky top-0 z-50 w-full overflow-hidden border-b border-[#1a1a1a] bg-[#0a0a0a] shadow-lg shadow-[#00ff9580]"
        >
          <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-2 md:px-6">
            <div className="flex-1" />
            <PreFetchUrl
              href="/contact"
              className="cursor-pointer text-center text-sm font-medium text-[#00ff95] md:text-base"
              onClick={() => {
                setShow(false);
              }}
            >
              Would you like to collab with me or hire me?
            </PreFetchUrl>
            <div className="flex flex-1 justify-end">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  setShow(false);
                }}
                className="inline-flex items-center justify-center rounded-full text-[#00ff95] transition-colors"
                aria-label="Close banner"
              >
                <XIcon className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
