import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";

interface ScrollToBottomButtonProps {
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  onClick: () => void;
}

export const ScrollToBottomButton = ({
  scrollAreaRef,
  onClick,
}: ScrollToBottomButtonProps) => {
  const [showButton, setShowButton] = useState(false);
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    // Find the viewport element which is the actual scrollable part
    const viewport =
      scrollArea.querySelector("[data-radix-scroll-area-viewport]") ||
      scrollArea.querySelector('[data-slot="scroll-area-viewport"]') ||
      scrollArea.querySelector(".ScrollAreaViewport") ||
      scrollArea.querySelector('[data-radix-scroll-area="viewport"]');

    if (!viewport) {
      console.error("Could not find viewport for scroll-to-bottom button");
      return;
    }

    const checkScrollPosition = () => {
      // Show button when user has scrolled up more than 300px from bottom (made more sensitive)
      const isScrolledUp =
        viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight >
        300;
      setShowButton(isScrolledUp);
    };

    // Initial check
    checkScrollPosition();

    // Add scroll event listener
    viewport.addEventListener("scroll", checkScrollPosition, {
      passive: true,
    });

    return () => {
      viewport.removeEventListener("scroll", checkScrollPosition);
    };
  }, [scrollAreaRef]);

  if (!showButton) return null;

  return (
    <Button
      className="absolute bottom-20 right-8 rounded-full opacity-80 hover:opacity-100 shadow-md z-10"
      variant="default"
      size="icon"
      onClick={onClick}
    >
      <ArrowDown className="h-4 w-4" />
    </Button>
  );
};
