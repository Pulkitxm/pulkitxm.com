import { motion, AnimatePresence } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import React, { ReactNode, useState, useId, createContext, useContext } from "react";

interface AccordionProps {
  type?: "single" | "multiple";
  collapsible?: boolean;
  children: ReactNode;
  defaultValue?: string[];
}

interface AccordionItemProps {
  value: string;
  children: ReactNode;
}

interface AccordionTriggerProps {
  children: ReactNode;
  onClick?: () => void;
  isOpen?: boolean;
  id?: string;
}

interface AccordionContentProps {
  children: ReactNode;
  isOpen?: boolean;
  id?: string;
}

function Accordion({ type = "single", collapsible = false, children, defaultValue = [] }: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultValue);

  function toggleItem(value: string) {
    if (type === "single") {
      setOpenItems((prev) => (prev[0] === value ? (collapsible ? [] : prev) : [value]));
    } else {
      setOpenItems((prev) =>
        prev.includes(value) ? (collapsible ? prev.filter((v) => v !== value) : prev) : [...prev, value]
      );
    }
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div>{children}</div>
    </AccordionContext.Provider>
  );
}

const AccordionContext = createContext<{
  openItems: string[];
  toggleItem: (value: string) => void;
} | null>(null);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion components must be used within Accordion");
  return ctx;
}

function AccordionItem({ value, children }: AccordionItemProps) {
  const { openItems } = useAccordion();
  const isOpen = openItems.includes(value);
  return (
    <div data-state={isOpen ? "open" : "closed"} className="border-b last:border-b-0">
      {React.Children.map(children, (child) =>
        typeof child === "object" && child && "props" in child
          ? React.cloneElement(child as React.ReactElement<{ isOpen: boolean; value: string }>, { isOpen, value })
          : child
      )}
    </div>
  );
}

function AccordionTrigger({ children, onClick, isOpen, value, id }: AccordionTriggerProps & { value?: string }) {
  const { toggleItem } = useAccordion();
  const _id = useId();
  const buttonId = id || _id;
  return (
    <button
      id={buttonId}
      aria-expanded={isOpen}
      aria-controls={`content-${buttonId}`}
      onClick={() => {
        if (value) toggleItem(value);
        if (onClick) onClick();
      }}
      className={`focus-visible:ring-primary bg-primary/10 flex size-full cursor-pointer items-center justify-between select-none ${
        isOpen ? "rounded-t-lg" : "rounded-lg"
      } px-4 py-4 text-left font-medium transition-all focus:outline-none focus-visible:ring-2`}
      type="button"
    >
      <span>{children}</span>
      <motion.span
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="ml-2 inline-block"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </motion.span>
    </button>
  );
}

function AccordionContent({ children, isOpen, id }: AccordionContentProps) {
  const _id = useId();
  const contentId = id || _id;
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          id={`content-${contentId}`}
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { height: "auto", opacity: 1 },
            collapsed: { height: 0, opacity: 0 }
          }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="pt-0 pb-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
