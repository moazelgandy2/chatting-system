import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useScrollAreaViewport } from "./use-scroll-area-viewport";

interface ScrollToBottomButtonProps {
  scrollAreaRef:
    | React.MutableRefObject<HTMLDivElement | null>
    | React.RefObject<HTMLDivElement | null>;
  onClick: () => void;
  hasNewMessages?: boolean;
}

export const ScrollToBottomButton = ({
  scrollAreaRef,
  onClick,
  hasNewMessages = false,
}: ScrollToBottomButtonProps) => {
  const [showButton, setShowButton] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const throttleRef = useRef<NodeJS.Timeout | null>(null);
  const { viewportElement } =
    useScrollAreaViewport<HTMLDivElement>(scrollAreaRef);
  useEffect(() => {
    if (!viewportElement) {
      return;
    }

    const checkScrollPosition = () => {
      if (!viewportElement) return;

      // Show button when user has scrolled up more than 300px from bottom
      const distanceFromBottom =
        viewportElement.scrollHeight -
        viewportElement.scrollTop -
        viewportElement.clientHeight;

      const isScrolledUp = distanceFromBottom > 300;
      setShowButton(isScrolledUp);

      // If user scrolls to bottom, mark messages as read
      if (!isScrolledUp) {
        setHasUnreadMessages(false);
      }
    };

    // Throttle function to avoid excessive calculations
    const throttledCheckScroll = () => {
      if (throttleRef.current) return;

      throttleRef.current = setTimeout(() => {
        checkScrollPosition();
        throttleRef.current = null;
      }, 100);
    };

    // Initial check
    checkScrollPosition();

    // Add scroll event listener
    viewportElement.addEventListener("scroll", throttledCheckScroll, {
      passive: true,
    });

    return () => {
      viewportElement.removeEventListener("scroll", throttledCheckScroll);
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
    };
  }, [viewportElement]);

  // Set unread indicator when new messages arrive and user isn't at bottom
  useEffect(() => {
    if (hasNewMessages && showButton) {
      setHasUnreadMessages(true);
    }
  }, [hasNewMessages, showButton]);
  if (!showButton) return null;

  return (
    <Button
      className="absolute bottom-20 right-8 rounded-full shadow-md z-10 transition-all duration-300"
      variant={hasUnreadMessages ? "destructive" : "default"}
      size="icon"
      onClick={() => {
        onClick();
        setHasUnreadMessages(false);
      }}
    >
      <ArrowDown className="h-4 w-4" />
      {hasUnreadMessages && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
      )}
    </Button>
  );
};
