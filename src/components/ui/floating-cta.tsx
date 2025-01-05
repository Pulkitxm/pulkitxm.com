"use client";

import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function CollabInviteLayer() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const initialShow = localStorage.getItem("collab-invite-layer") === "false" ? false : true;
    setShow(initialShow);
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
          className="fixed left-0 top-0 z-50 w-full cursor-pointer overflow-hidden border-b border-[#1a1a1a] bg-[#0a0a0a] shadow-lg shadow-[#00ff9580]"
          onClick={() => router.push("/contact")}
        >
          <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-2 md:px-6">
            <div className="flex-1" />
            <motion.p
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-center text-sm font-medium text-[#00ff95] md:text-base"
            >
              Would you like to collab with me or hire me?
            </motion.p>
            <div className="flex flex-1 justify-end">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShow(false);
                  localStorage.setItem("collab-invite-layer", "false");
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
