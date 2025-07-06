"use client";

import { AnimatePresence, motion, HTMLMotionProps } from "framer-motion";
import { XIcon } from "lucide-react";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { cn } from "@/lib/utils";

interface SheetContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextProps | undefined>(undefined);

function Sheet({
  open: controlledOpen,
  defaultOpen,
  onOpenChange,
  children
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen ?? false);
  const isControlled = controlledOpen !== undefined;
  const actualOpen = isControlled ? controlledOpen : open;

  const setSheetOpen = (value: boolean) => {
    if (!isControlled) setOpen(value);
    onOpenChange?.(value);
  };

  return <SheetContext.Provider value={{ open: actualOpen, setOpen: setSheetOpen }}>{children}</SheetContext.Provider>;
}

function SheetTrigger(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(SheetContext);
  return <button data-slot="sheet-trigger" type="button" onClick={() => ctx?.setOpen(true)} {...props} />;
}

function SheetClose(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(SheetContext);
  return <button data-slot="sheet-close" type="button" onClick={() => ctx?.setOpen(false)} {...props} />;
}

function SheetPortal({ children }: { children: React.ReactNode }) {
  if (typeof window === "undefined") return null;
  return ReactDOM.createPortal(children, document.body);
}

function SheetOverlay({ className, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      data-slot="sheet-overlay"
      initial={{ opacity: 0, transition: { ease: "easeInOut", duration: 0.2 } }}
      animate={{ opacity: 1, transition: { ease: "easeInOut", duration: 0.3 } }}
      exit={{ opacity: 0, transition: { ease: "easeInOut", duration: 0.2 } }}
      className={cn("fixed inset-0 z-[10000] bg-black/50", className)}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = "right",
  ...rest
}: {
  className?: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
} & HTMLMotionProps<"div">) {
  const ctx = React.useContext(SheetContext);
  if (!ctx) return null;
  const { open, setOpen } = ctx;

  const variants = {
    right: {
      initial: { x: "100%", transition: { ease: "easeInOut", duration: 0.2 } },
      animate: { x: 0, transition: { ease: "easeInOut", duration: 0.3 } },
      exit: { x: "100%", transition: { ease: "easeInOut", duration: 0.2 } }
    },
    left: {
      initial: { x: "-100%", transition: { ease: "easeInOut", duration: 0.2 } },
      animate: { x: 0, transition: { ease: "easeInOut", duration: 0.3 } },
      exit: { x: "-100%", transition: { ease: "easeInOut", duration: 0.2 } }
    },
    top: {
      initial: { y: "-100%", transition: { ease: "easeInOut", duration: 0.2 } },
      animate: { y: 0, transition: { ease: "easeInOut", duration: 0.3 } },
      exit: { y: "-100%", transition: { ease: "easeInOut", duration: 0.2 } }
    },
    bottom: {
      initial: { y: "100%", transition: { ease: "easeInOut", duration: 0.2 } },
      animate: { y: 0, transition: { ease: "easeInOut", duration: 0.3 } },
      exit: { y: "100%", transition: { ease: "easeInOut", duration: 0.2 } }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <SheetPortal>
          <SheetOverlay onClick={() => setOpen(false)} />
          <motion.div
            data-slot="sheet-content"
            initial={variants[side].initial}
            animate={variants[side].animate}
            exit={variants[side].exit}
            className={cn(
              "bg-background fixed z-[10000] flex flex-col gap-4 shadow-lg transition ease-in-out",
              side === "right" && "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
              side === "left" && "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
              side === "top" && "inset-x-0 top-0 h-auto border-b",
              side === "bottom" && "inset-x-0 bottom-0 h-auto border-t",
              className
            )}
            {...rest}
          >
            {children}
            <button
              data-slot="sheet-close"
              type="button"
              onClick={() => setOpen(false)}
              className="ring-offset-background focus:ring-ring absolute top-4 right-4 cursor-pointer rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
            >
              <XIcon className="size-4" />
              <span className="sr-only">Close</span>
            </button>
          </motion.div>
        </SheetPortal>
      )}
    </AnimatePresence>
  );
}

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-1.5 p-4", className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="sheet-footer" className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 data-slot="sheet-title" className={cn("text-foreground font-semibold", className)} {...props} />;
}

function SheetDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p data-slot="sheet-description" className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };
