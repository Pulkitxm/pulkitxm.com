import { User } from "lucide-react";
import { StaticImageData } from "next/image";
import { FC } from "react";

import { renderMessage } from "@/lib/chatUtils";
import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";

type ChatMessageProps = {
  message: Message;
  profileImage: StaticImageData;
  isSameDomain: (url: string) => boolean;
};

export const ChatMessage: FC<ChatMessageProps> = ({ message, profileImage, isSameDomain }) => {
  const { role, content } = message;

  return (
    <div className={cn("flex w-full", role === "user" ? "justify-end" : "justify-start")}>
      {role === "assistant" && (
        <div className="mr-2 flex h-8 w-8 shrink-0 items-start justify-center">
          <img
            src={profileImage.src || "/placeholder.svg"}
            alt="Pukbot"
            width={32}
            height={32}
            className="rounded-full border border-green-400"
          />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] whitespace-pre-wrap break-words rounded-lg px-3 py-2 text-sm font-medium",
          role === "user" ? "rounded-br-none bg-gray-600 text-white" : "rounded-bl-none bg-green-600 text-white"
        )}
      >
        {role === "assistant"
          ? renderMessage(content, isSameDomain)
          : content.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i !== content.split("\n").length - 1 && <br />}
              </span>
            ))}
      </div>
      {role === "user" && (
        <div className="ml-2 flex h-8 w-8 shrink-0 items-start justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-500 bg-gray-700">
            <User size={16} className="text-gray-300" />
          </div>
        </div>
      )}
    </div>
  );
};
