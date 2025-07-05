"use client";

import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "lucide-react";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { useEffect, useState } from "react";

import { PreFetchUrl } from "../PreFetchUrl";

export default function CollabInviteLayer() {
  const showFloatingCTA = useFeatureFlagEnabled("floating-cta") !== false;
  if (!showFloatingCTA) return null;

  return <CollabInviteLayerCX />;
}

function CollabInviteLayerCX() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const hideCta = localStorage.getItem("hideCta") == "true";
      setShow(!hideCta);
    }, 1000);
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
          className="border-border dark:bg-background/95 sticky top-0 z-50 w-full overflow-hidden border-b bg-[#756050] shadow-lg"
        >
          <div className="mx-auto flex max-w-(--breakpoint-xl) items-center justify-between px-4 py-2 md:px-6">
            <div className="flex-1" />
            <PreFetchUrl
              href="/contact"
              className="cursor-pointer text-center text-sm font-medium text-white md:text-base dark:text-green-400"
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
                className="inline-flex cursor-pointer items-center justify-center rounded-full text-white transition-colors dark:text-[#00ff95]"
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
