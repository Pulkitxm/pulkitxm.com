import { motion } from "framer-motion";
import { StaticImageData } from "next/image";
import { FC } from "react";

type ChatLauncherButtonProps = {
  profileImage: StaticImageData;
  isOpen: boolean;
  onClick: () => void;
};

const buttonHoverAnimation = { scale: 1.05 };
const buttonTapAnimation = { scale: 0.95 };

export const ChatLauncherButton: FC<ChatLauncherButtonProps> = ({ profileImage, isOpen, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={buttonHoverAnimation}
      whileTap={buttonTapAnimation}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 shadow-md focus:outline-none"
      aria-label="Open chat"
      title="Chat with Pukbot"
    >
      <div className="relative">
        <img
          src={profileImage.src || "/placeholder.svg"}
          alt="Pukbot"
          width={44}
          height={44}
          className="rounded-full border-2 border-green-400"
        />
        {!isOpen && (
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              repeatType: "reverse"
            }}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-400 text-[10px] font-black text-black"
          >
            !?
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};
