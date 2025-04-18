"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback, KeyboardEvent, ChangeEvent } from "react";

import { getChatResponse, getSuggestionsForChat } from "@/actions/chat";
import profile from "@/data/profile";
import { formatMessage, getRandomLoadingText, addRandomEmoji, isSameDomain } from "@/lib/chatUtils";
import { Message, Suggestion } from "@/types/chat";

import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatLauncherButton } from "./ChatLauncherButton";
import { ChatMessage } from "./ChatMessages";
import { LoadingMessage } from "./LoadingMessage";
import { SuggestionsBar } from "./SuggestionsBar";

const springTransition = { type: "spring", stiffness: 400, damping: 30 };

export default function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [sortAlphabetically, setSortAlphabetically] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();
  const chatInitialized = useRef(false);
  const suggestionsLoaded = useRef(false);

  // Default suggestions based on current page
  const getDefaultSuggestions = useCallback(() => {
    const pageSuggestion =
      pathname === "/" ? "Pulkit's skills?" : pathname.includes("/projects") ? "Recent projects?" : "About this page?";

    return ["Worth hiring?", "Who are you?", "Roast Pulkit", pageSuggestion];
  }, [pathname]);

  const generateRoast = useCallback(async () => {
    setLoading(true);
    setLoadingText("Cooking up a savage roast...");

    const roastPrompt =
      "Generate a hilarious, over-the-top roast of Pulkit as a developer. Be creative, exaggerated and funny but not mean-spirited. Include emoji at the end. Keep it under 280 characters.";

    const response = await getChatResponse(roastPrompt, "Pukbot", pathname);

    return (
      response.answer ||
      "Pulkit's code is like his debugging strategy - chaotic, unpredictable, and somehow works in the end! 🔥"
    );
  }, [pathname]);

  const generateSuggestions = useCallback(async () => {
    if (loadingSuggestions || !open) return;

    setLoadingSuggestions(true);

    try {
      const response = await getSuggestionsForChat(messages, pathname);

      if (response.length > 0) {
        const shortSuggestions = response.map((s) => (s.length > 30 ? s.substring(0, 27) + "..." : s));
        setSuggestions(sortAlphabetically ? [...shortSuggestions].sort() : shortSuggestions);
      } else {
        setSuggestions(getDefaultSuggestions());
      }
      suggestionsLoaded.current = true;
    } catch (e) {
      console.error("Failed to generate suggestions", e);
      setSuggestions(getDefaultSuggestions());
    } finally {
      setLoadingSuggestions(false);
    }
  }, [messages, pathname, sortAlphabetically, loadingSuggestions, getDefaultSuggestions, open]);

  const initializeChat = useCallback(async () => {
    if (!open) return;

    setLoading(true);
    setLoadingText(getRandomLoadingText());

    try {
      // Only load messages from localStorage if not already initialized
      if (!chatInitialized.current) {
        const storedMessages = localStorage.getItem("chatMessages");
        if (storedMessages) {
          const parsedMessages = JSON.parse(storedMessages);
          setMessages(parsedMessages);
          chatInitialized.current = true;

          // Load suggestions if chat is open
          if (!suggestionsLoaded.current) {
            generateSuggestions();
          }
          setLoading(false);
          return;
        }
      }

      // If no stored messages or first time initialization
      const introPrompt =
        "You are Pukbot, an AI assistant for Pulkit's portfolio. Introduce yourself in a wild, unhinged way. Keep it short and crisp. Make it clear you are PUKBOT, not Pulkit.";

      const response = await getChatResponse(introPrompt, "Pukbot", pathname);

      const introMessage = response.answer
        ? addRandomEmoji(response.answer)
        : "YOOOOO WHAT'S UP?! I'm PUKBOT, Pulkit's chaotic AI assistant! Ask me ANYTHING about him!";

      const formattedMessage: Message = { role: "assistant", content: formatMessage(introMessage) };
      setMessages([formattedMessage]);
      chatInitialized.current = true;

      // Load suggestions if chat is open
      if (!suggestionsLoaded.current) {
        generateSuggestions();
      }
    } catch (error) {
      console.error("Failed to initialize chat:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Oops! I had trouble starting up. But I'm here now! Ask me anything about Pulkit! 🤪"
      };
      setMessages([errorMessage]);
      chatInitialized.current = true;
    } finally {
      setLoading(false);
    }
  }, [pathname, generateSuggestions, open]);

  const send = useCallback(async () => {
    if (!input.trim()) return;
    const q = input.trim();
    setInput("");

    const userMessage: Message = { role: "user", content: q };
    setMessages((m) => [...m, userMessage]);

    setLoading(true);
    setLoadingText(getRandomLoadingText());

    try {
      if (q.toLowerCase().includes("roast")) {
        const roast = await generateRoast();
        const assistantMessage: Message = { role: "assistant", content: formatMessage(roast) };
        setMessages((m) => [...m, assistantMessage]);
        setLoading(false);
        return;
      }

      let contextualQuestion = q;
      if (q.toLowerCase().includes("this page") || q.toLowerCase().includes("current page")) {
        contextualQuestion = `The user is currently on the page: ${pathname}. ${q}`;
      }

      const enhancedQuestion = `You are PUKBOT, an AI assistant for Pulkit's portfolio. You are NOT Pulkit himself. Answer as PUKBOT. Format your response using Markdown when appropriate, especially for links and lists. ${contextualQuestion}`;

      const response = await getChatResponse(enhancedQuestion, "Pukbot", pathname);

      const enhancedAnswer = response.answer || "Bruh, I broke. Try again!";
      const assistantMessage: Message = { role: "assistant", content: formatMessage(enhancedAnswer) };

      setMessages((m) => [...m, assistantMessage]);
    } catch (e) {
      console.error(e);
      const errorMessage: Message = {
        role: "assistant",
        content: "LMAO I CRASHED! Something's broken but that's how I roll! 🤪"
      };
      setMessages((m) => [...m, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [input, pathname, generateRoast]);

  const handleTextareaChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  }, []);

  const clearChat = useCallback(() => {
    localStorage.removeItem("chatMessages");
    chatInitialized.current = false;
    suggestionsLoaded.current = false;
    initializeChat();
  }, [initializeChat]);

  const toggleSuggestionSort = useCallback(() => {
    setSortAlphabetically((prev) => !prev);
    setSuggestions((prev) => (prev.length > 0 ? (sortAlphabetically ? prev : [...prev].sort()) : prev));
  }, [sortAlphabetically]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    [send]
  );

  // Initialize chat when opened
  useEffect(() => {
    if (open && !chatInitialized.current) {
      initializeChat();
    }
  }, [open, initializeChat]);

  // Load suggestions when chat is opened
  useEffect(() => {
    if (open && !suggestionsLoaded.current && messages.length > 0) {
      generateSuggestions();
    }
  }, [open, generateSuggestions, messages]);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;

      requestAnimationFrame(() => {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: "smooth"
        });
      });
    }
  }, [messages, loading, open]);

  // Focus input when chat opens
  useEffect(() => {
    if (open && inputRef.current) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  // Update loading text
  useEffect(() => {
    if (loading) {
      setLoadingText(getRandomLoadingText());
    }
  }, [loading]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={springTransition}
            className="fixed inset-0 z-50 flex flex-col overflow-hidden border border-green-600/50 bg-gray-900/95 shadow-xl md:bottom-24 md:left-auto md:right-6 md:top-auto md:h-[70vh] md:max-h-[600px] md:w-full md:max-w-md md:rounded-xl"
          >
            <ChatHeader
              profileImage={profile.image || "/placeholder.svg"}
              onClose={() => setOpen(false)}
              onClear={clearChat}
            />

            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto bg-gray-800 p-4"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\")"
              }}
            >
              {messages.map((message, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.03 * Math.min(i, 10) }}
                >
                  <ChatMessage
                    message={message}
                    profileImage={profile.image || "/placeholder.svg"}
                    isSameDomain={isSameDomain}
                  />
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <LoadingMessage profileImage={profile.image || "/placeholder.svg"} loadingText={loadingText} />
                </motion.div>
              )}
            </div>

            <div className="border-t border-green-600/50 bg-green-800/90 px-4 py-3">
              <SuggestionsBar
                suggestions={suggestions}
                loadingSuggestions={loadingSuggestions}
                sortAlphabetically={sortAlphabetically}
                onSuggestionClick={setInput}
                onToggleSort={toggleSuggestionSort}
                onRefresh={generateSuggestions}
              />

              <ChatInput
                input={input}
                loading={loading}
                inputRef={inputRef}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                onSend={send}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ChatLauncherButton
        profileImage={profile.image || "/placeholder.svg"}
        isOpen={open}
        onClick={() => setOpen((prev) => !prev)}
      />
    </>
  );
}
