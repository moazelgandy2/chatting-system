"use client";

import { cn } from "@/lib/utils";
import { forwardRef, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageType } from "./messages-area";

interface MessageItemWrapperProps {
  message: MessageType;
  children: React.ReactNode;
  isGrouped: boolean;
  isUser: boolean;
  scrollIntoView?: boolean;
  className?: string;
}

/**
 * Performance-optimized message wrapper component
 * Handles animations and scroll effects for chat messages
 */
export const MessageItemWrapper = forwardRef<
  HTMLDivElement,
  MessageItemWrapperProps
>(
  (
    { message, children, isGrouped, isUser, scrollIntoView = false, className },
    ref
  ) => {
    // Create an internal ref for animation scrolling
    const messageRef = useRef<HTMLDivElement>(null);

    // Handle auto-scroll when the scrollIntoView prop is true
    useEffect(() => {
      if (scrollIntoView && messageRef.current) {
        const scrollOptions: ScrollIntoViewOptions = {
          behavior: "smooth",
          block: "end",
        };

        const scrollTimer = setTimeout(() => {
          messageRef.current?.scrollIntoView(scrollOptions);
        }, 100);

        return () => clearTimeout(scrollTimer);
      }
    }, [scrollIntoView]);

    return (
      <motion.div
        ref={(el) => {
          // Assign to both refs
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
          messageRef.current = el;
        }}
        data-message={message.id}
        data-sender={message.sender}
        data-timestamp={message.timestamp.getTime()}
        initial={
          scrollIntoView
            ? {
                opacity: 0,
                y: 20,
                scale: 0.95,
              }
            : false
        }
        animate={{
          opacity: 1,
          y: 0,
          scale: scrollIntoView ? [0.95, 1.02, 1] : 1,
        }}
        transition={{
          duration: scrollIntoView ? 0.6 : 0.4,
          type: "spring",
        }}
        className={cn(
          "flex items-start gap-3 group",
          isGrouped ? "mb-1" : "mb-4",
          isUser ? "flex-row-reverse" : "",
          "hover:bg-accent/20 rounded-lg p-2 transition-colors duration-200",
          scrollIntoView && "relative message-highlight",
          className
        )}
      >
        {children}
      </motion.div>
    );
  }
);

MessageItemWrapper.displayName = "MessageItemWrapper";
