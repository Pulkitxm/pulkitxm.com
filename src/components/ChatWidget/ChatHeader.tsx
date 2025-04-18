import { motion } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { Zap } from "lucide-react";
import { StaticImageData } from "next/image";
import { FC } from "react";

type ChatHeaderProps = {
  profileImage: StaticImageData;
  onClose: () => void;
  onClear: () => void;
};

const buttonHoverAnimation = { scale: 1.05 };
const buttonTapAnimation = { scale: 0.95 };

export const ChatHeader: FC<ChatHeaderProps> = ({ profileImage, onClose, onClear }) => {
  return (
    <div className="flex items-center justify-between border-b border-green-600/50 bg-green-800/90 px-4 py-3">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={profileImage.src || "/placeholder.svg"}
            alt="Pukbot"
            width={40}
            height={40}
            className="rounded-full border border-green-400"
          />
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-400 text-xs font-bold text-black">
            <Zap size={12} />
          </span>
        </div>
        <div>
          <h2 className="text-lg font-black uppercase tracking-wide text-green-400">Pukbot</h2>
          <p className="text-xs font-bold text-green-300">Unhinged & Unfiltered</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={buttonHoverAnimation}
          whileTap={buttonTapAnimation}
          onClick={onClear}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-green-700 text-white"
          aria-label="Clear chat"
          title="Clear chat history"
        >
          <Trash2 size={16} />
        </motion.button>
        <motion.button
          whileHover={buttonHoverAnimation}
          whileTap={buttonTapAnimation}
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white"
          aria-label="Close chat"
          title="Close chat"
        >
          <X size={16} />
        </motion.button>
      </div>
    </div>
  );
};
