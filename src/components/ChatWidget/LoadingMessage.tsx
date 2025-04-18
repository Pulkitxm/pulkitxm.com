import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { FC } from "react";

type LoadingMessageProps = {
  profileImage: StaticImageData;
  loadingText: string;
};

export const LoadingMessage: FC<LoadingMessageProps> = ({ profileImage, loadingText }) => {
  return (
    <div className="flex items-start">
      <div className="mr-2 flex h-8 w-8 shrink-0 items-start justify-center">
        <Image
          src={profileImage || "/placeholder.svg"}
          alt="typing"
          width={32}
          height={32}
          className="rounded-full border border-green-400"
        />
      </div>
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          repeatType: "mirror"
        }}
        className="rounded-lg rounded-bl-none bg-green-600 px-3 py-2 text-sm font-medium text-white"
      >
        <div className="flex items-center gap-2">
          {loadingText}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "linear"
            }}
          >
            <span className="text-green-300">⚡</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
