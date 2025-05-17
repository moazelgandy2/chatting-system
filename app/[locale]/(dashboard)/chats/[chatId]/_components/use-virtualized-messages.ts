import { useCallback, useEffect, useRef, useState } from "react";

interface UseVirtualizedMessagesProps {
  messages: any[];
  viewportElement: HTMLElement | null;
  overscan?: number;
}

/**
 * Custom hook that provides message virtualization to handle large chat histories efficiently
 * Only renders messages that are visible in the viewport plus a buffer (overscan)
 */
export function useVirtualizedMessages({
  messages,
  viewportElement,
  overscan = 10,
}: UseVirtualizedMessagesProps) {
  const [visibleRange, setVisibleRange] = useState({
    start: 0,
    end: messages.length,
  });
  const lastMeasuredRef = useRef<{ index: number; offset: number }[]>([]);
  const estimatedItemHeight = 100; // Average height of a message in pixels

  // Calculate the visible range of messages based on scroll position
  const calculateVisibleRange = useCallback(() => {
    if (!viewportElement || messages.length === 0) return;

    const scrollTop = viewportElement.scrollTop;
    const viewportHeight = viewportElement.clientHeight;

    // Simplified approach assuming roughly uniform message heights
    // In a production app, we'd measure actual heights and cache them
    let startIndex = Math.max(
      0,
      Math.floor(scrollTop / estimatedItemHeight) - overscan
    );
    let endIndex = Math.min(
      messages.length,
      Math.ceil((scrollTop + viewportHeight) / estimatedItemHeight) + overscan
    );

    // Always include the first few messages for context
    if (startIndex > 0 && startIndex < 5) {
      startIndex = 0;
    }

    // Always include the most recent messages at the bottom
    if (endIndex > messages.length - 5 && endIndex < messages.length) {
      endIndex = messages.length;
    }

    setVisibleRange({ start: startIndex, end: endIndex });
  }, [messages.length, viewportElement, overscan]);

  // Set up scroll listener to recalculate visible range on scroll
  useEffect(() => {
    if (!viewportElement) return;

    // Initial calculation
    calculateVisibleRange();

    // Throttled scroll handler
    let isScrolling = false;
    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        window.requestAnimationFrame(() => {
          calculateVisibleRange();
          isScrolling = false;
        });
      }
    };

    viewportElement.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      viewportElement.removeEventListener("scroll", handleScroll);
    };
  }, [viewportElement, calculateVisibleRange]);

  // Recalculate when messages change
  useEffect(() => {
    calculateVisibleRange();
  }, [messages, calculateVisibleRange]);

  // Get the subset of messages that should be rendered
  const virtualizedMessages = messages.slice(
    visibleRange.start,
    visibleRange.end
  );

  // Information for positioning
  const startOffset = visibleRange.start * estimatedItemHeight;
  const endPadding = (messages.length - visibleRange.end) * estimatedItemHeight;

  return {
    virtualizedMessages,
    startOffset,
    endPadding,
    visibleRange,
    isVirtualized: messages.length > 50, // Only virtualize if we have more than 50 messages
  };
}
