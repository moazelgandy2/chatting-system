import { useCallback } from "react";

// Easing functions
const easings = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
};

type EasingFunction = keyof typeof easings;

export function useSmoothScroll() {
  /**
   * Smoothly scrolls an element to the bottom with custom easing
   */
  const scrollToBottom = useCallback(
    (
      element: HTMLElement,
      duration = 500,
      easing: EasingFunction = "easeOutCubic"
    ) => {
      const start = element.scrollTop;
      const end = element.scrollHeight - element.clientHeight;
      const change = end - start;
      const increment = 15; // update interval in ms

      if (Math.abs(change) < 10) {
        // For tiny changes, just jump to the position
        element.scrollTop = end;
        return;
      }

      const animateScroll = (elapsedTime: number) => {
        elapsedTime += increment;
        const position = easings[easing](Math.min(elapsedTime / duration, 1));
        element.scrollTop = start + change * position;

        if (elapsedTime < duration) {
          setTimeout(() => animateScroll(elapsedTime), increment);
        }
      };

      animateScroll(0);
    },
    []
  );

  /**
   * Smoothly scrolls a container to an element with offset and custom easing
   */
  const scrollContainerToElement = useCallback(
    (
      container: HTMLElement,
      element: HTMLElement,
      duration = 500,
      offset = 0,
      easing: EasingFunction = "easeOutCubic"
    ) => {
      // Get element position relative to container
      const elementRect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const relativeTop =
        elementRect.top - containerRect.top + container.scrollTop;

      const start = container.scrollTop;
      const end = relativeTop + offset;
      const change = end - start;
      const increment = 15;

      if (Math.abs(change) < 10) {
        // For tiny changes, just jump to the position
        container.scrollTop = end;
        return;
      }

      const animateScroll = (elapsedTime: number) => {
        elapsedTime += increment;
        const position = easings[easing](Math.min(elapsedTime / duration, 1));
        container.scrollTop = start + change * position;

        if (elapsedTime < duration) {
          setTimeout(() => animateScroll(elapsedTime), increment);
        }
      };

      animateScroll(0);
    },
    []
  );

  return { scrollToBottom, scrollContainerToElement };
}
