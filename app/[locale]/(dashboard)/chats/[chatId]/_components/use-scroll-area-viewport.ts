import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook to get the scrollable viewport element from a Radix UI ScrollArea
 * This handles different versions of Radix UI and their varying data attributes
 */
export function useScrollAreaViewport<T extends HTMLElement>(
  // Use more permissive typing to avoid strict null checking issues
  scrollAreaRef: React.MutableRefObject<T | null> | React.RefObject<T | null>
) {
  // Use a state to track the viewport element for reactive updates
  const [viewportElement, setViewportElement] = useState<HTMLElement | null>(
    null
  );

  // Try all possible selectors to find the viewport element
  const findViewport = useCallback((): HTMLElement | null => {
    if (!scrollAreaRef.current) return null;

    console.log("Finding viewport from element:", scrollAreaRef.current);

    // Try different possible selectors for the viewport element
    const viewport =
      ((scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) ||
        scrollAreaRef.current.querySelector(
          '[data-slot="scroll-area-viewport"]'
        ) ||
        scrollAreaRef.current.querySelector(".ScrollAreaViewport") ||
        scrollAreaRef.current.querySelector('div[style*="overflow"]') || // Look for elements with overflow styling
        scrollAreaRef.current.querySelector(
          '[data-radix-scroll-area="viewport"]'
        )) as HTMLElement) || null;

    if (viewport) {
      console.log("Found viewport:", viewport);
    } else {
      // Debug what elements we do have
      console.error(
        "Could not find viewport element. Available children:",
        [...scrollAreaRef.current.querySelectorAll("*")].map((el) => ({
          tag: el.tagName,
          id: el.id,
          classes: el.className,
          attributes: [...el.attributes]
            .map((attr) => `${attr.name}="${attr.value}"`)
            .join(" "),
        }))
      );
    }

    return viewport;
  }, [scrollAreaRef]);

  // Return a getter function that will always return the latest viewport
  const getViewportElement = useCallback((): HTMLElement | null => {
    // If we already have a viewport element, return it
    if (viewportElement) return viewportElement;

    // Otherwise try to find it again
    return findViewport();
  }, [viewportElement, findViewport]);

  // Update the viewport element when the ref changes
  useEffect(() => {
    const viewport = findViewport();
    setViewportElement(viewport);

    // Poll for a short time to handle cases where the component renders after this effect
    let attempts = 0;
    const interval = setInterval(() => {
      if (attempts >= 5) {
        clearInterval(interval);
        return;
      }

      const newViewport = findViewport();
      if (newViewport && newViewport !== viewport) {
        setViewportElement(newViewport);
        clearInterval(interval);
      }

      attempts++;
    }, 100);

    return () => clearInterval(interval);
  }, [scrollAreaRef, findViewport]);

  return { getViewportElement, viewportElement };
}
