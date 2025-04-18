import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { FC, KeyboardEvent, ChangeEvent, RefObject } from "react";

import { cn } from "@/lib/utils";

type ChatInputProps = {
  input: string;
  loading: boolean;
  inputRef: RefObject<HTMLTextAreaElement>;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
};

const buttonHoverAnimation = { scale: 1.05 };
const buttonTapAnimation = { scale: 0.95 };

export const ChatInput: FC<ChatInputProps> = ({ input, loading, inputRef, onChange, onKeyDown, onSend }) => {
  return (
    <div className="flex items-end space-x-2 rounded-md bg-gray-700/80 p-1">
      <textarea
        ref={inputRef}
        rows={1}
        value={input}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Ask me ANYTHING... 🤪"
        className="w-full resize-none overflow-y-auto bg-transparent px-3 py-2 text-sm text-gray-100 placeholder-green-300 focus:outline-none"
        style={{
          height: "38px",
          maxHeight: "120px",
          lineHeight: "1.5",
          overflowY: "auto",
          display: "block"
        }}
      />
      <motion.button
        whileHover={buttonHoverAnimation}
        whileTap={buttonTapAnimation}
        onClick={onSend}
        disabled={loading || !input.trim()}
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-all",
          input.trim() ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-600/50 text-gray-400"
        )}
        aria-label="Send message"
        title="Send message"
      >
        <Send size={16} />
      </motion.button>
    </div>
  );
};
