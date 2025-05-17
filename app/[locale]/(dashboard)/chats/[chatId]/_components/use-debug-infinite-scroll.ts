import { useEffect } from "react";

/**
 * Custom hook to add performance debug information to the console
 * This is helpful during development but should be disabled in production
 */
export const useDebugInfiniteScroll = (options: {
  messages: any[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  isFetchingMore: boolean;
  viewportElement: HTMLElement | null;
  isVirtualized: boolean;
  virtualizedInfo?: {
    visibleRange: { start: number; end: number };
    totalCount: number;
  };
}) => {
  const {
    messages,
    page,
    hasMore,
    isLoading,
    isFetchingMore,
    viewportElement,
    isVirtualized,
    virtualizedInfo,
  } = options;

  // Log performance metrics on changes
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    console.log(`[INFINITE SCROLL DEBUG] Update: ${new Date().toISOString()}`, {
      messagesCount: messages.length,
      page,
      hasMore,
      isLoading,
      isFetchingMore,
      isViewportAvailable: !!viewportElement,
      isVirtualized,
      virtualizedRange: virtualizedInfo
        ? `${virtualizedInfo.visibleRange.start}-${virtualizedInfo.visibleRange.end} of ${virtualizedInfo.totalCount}`
        : "N/A",
      viewportMetrics: viewportElement
        ? {
            scrollTop: viewportElement.scrollTop,
            scrollHeight: viewportElement.scrollHeight,
            clientHeight: viewportElement.clientHeight,
            distanceFromBottom:
              viewportElement.scrollHeight -
              viewportElement.scrollTop -
              viewportElement.clientHeight,
          }
        : "N/A",
      estimatedMemoryUsage: `~${Math.round(
        (JSON.stringify(messages).length * 2) / 1024
      )}KB`,
    });
  }, [
    messages.length,
    page,
    hasMore,
    isLoading,
    isFetchingMore,
    viewportElement,
    isVirtualized,
    virtualizedInfo,
  ]);

  return null;
};
