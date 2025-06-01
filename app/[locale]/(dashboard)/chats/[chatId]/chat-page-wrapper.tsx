"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { MemoizedMessagesArea, MessageType } from "./_components/messages-area";
import { useChat, useChatRevalidate, useDeleteChat } from "@/hooks/use-chat";
import { ChatMessage } from "@/types/chats";
import ChatEmptyState from "./_components/chat-empty-state";
import { useAuth } from "@/hooks/useAuth";
import { LoadingIndicator } from "./_components/loading-indicator";
import { ScrollToBottomButton } from "./_components/scroll-to-bottom-button-fixed";
import { EndOfHistoryIndicator } from "./_components/end-of-history-indicator";
import { MessageSkeletonGroup } from "./_components/message-skeleton";
import { useScrollAreaViewport } from "./_components/use-scroll-area-viewport";
import { useVirtualizedMessages } from "./_components/use-virtualized-messages";
import { LoadError } from "./_components/load-error";
import { useRouter } from "next/navigation";
import { useChatsRevalidate } from "@/hooks/use-chats";
import { ChatDeleteDialog } from "./_components/chat-delete-dialog";
import { AssignPackageDialog } from "./_components/assign-package-dialog";
import { ManageClientLimits } from "./_components/manage-client-limits";
import { AdminStatus } from "./_components/admin-status";
import { cn } from "@/lib/utils";
import { MessageComposer } from "@/components/ui/message-composer";
import { useAssignedPackages } from "@/hooks/use-assign-package";
import { useChatWebSocket } from "@/hooks/use-chat-websocket";
import { WebSocketStatusIndicator } from "@/components/ui/websocket-status-indicator";

interface ChatPageWrapperProps {
  chatId: string;
  locale: string;
}

export default function ChatPageWrapper({
  chatId,
  locale: propLocale,
}: ChatPageWrapperProps) {
  const locale = useLocale();
  const t = useTranslations("chat");
  const isAr = useMemo(() => locale === "ar", [locale]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [consecutiveLoads, setConsecutiveLoads] = useState(0);
  const [lastLoadTimestamp, setLastLoadTimestamp] = useState(0);

  // Get assigned packages for this chat to extract clientId
  const { data: assignedPackages } = useAssignedPackages(chatId);
  // Define refs with proper TypeScript types
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevMessagesLengthRef = useRef<number>(0);
  // WebSocket connection - single instance for the entire chat
  const { status: wsConnectionStatus } = useChatWebSocket({
    chatId,
    enabled: true,
  });

  const { session } = useAuth();
  const currentUserId = session?.user?.id;
  const router = useRouter();
  const revalidate = useChatRevalidate(chatId);
  const chatsRevalidate = useChatsRevalidate();
  const { data, isLoading, isError, mutate } = useChat(chatId, page);
  const { mutate: mutateDeleteChat } = useDeleteChat();

  // Extract client ID from assigned packages
  useEffect(() => {
    if (assignedPackages?.data?.client_id) {
      setClientId(assignedPackages.data.client_id.toString());
    }
  }, [assignedPackages]);

  const retryLoading = useCallback(
    (specificPage?: number) => {
      if (specificPage) {
        setPage(specificPage);
      }

      setTimeout(() => {
        mutate();
      }, 100);
    },
    [mutate]
  );

  const isInitialLoading = isLoading && page === 1 && messages.length === 0;

  useEffect(() => {
    if (!data || !data.data) {
      if (isError && page > 1) {
        setPage((prev) => Math.max(prev - 1, 1));
        setIsFetchingMore(false);
        console.error("Failed to load more messages");
      }
      return;
    }

    if (Array.isArray(data.data.data)) {
      const mapped: MessageType[] = data.data.data
        .map((msg: ChatMessage): MessageType | null => {
          // Add safety check and logging
          if (!msg || typeof msg !== "object") {
            console.error("Invalid message object:", msg);
            return null;
          }

          const mappedMessage: MessageType = {
            id: String(msg.id),
            content: msg.message || "",
            sender: (msg.sender_id === currentUserId ? "user" : "agent") as
              | "agent"
              | "user",
            senderName: msg.sender?.name || "Unknown",
            timestamp: new Date(msg.created_at),
            media: msg.media || [], // Include processed media URLs
            client_package_item_id: msg.client_package_item_id,
            client_package_item: msg.client_package_item,
          };

          return mappedMessage;
        })
        .filter((msg): msg is MessageType => msg !== null); // Type-safe filter to remove null entries

      setMessages((prev) => {
        const ids = new Set(prev.map((m) => m.id));

        return page === 1
          ? mapped
          : [...mapped.filter((m) => !ids.has(m.id)), ...prev];
      });

      const currentPage = data.data.current_page;
      const lastPage = Math.ceil(data.data.total / data.data.per_page);
      const moreAvailable = currentPage < lastPage;

      setHasMore(moreAvailable);

      if (mapped.length === 0 && page > 1) {
        setHasMore(false);
      }

      setTimeout(() => {
        setConsecutiveLoads(0);
      }, 1000);
    } else {
      console.error("Unexpected data format:", data);
    }

    if (isFetchingMore) {
      setTimeout(() => setIsFetchingMore(false), 300);
    }
  }, [
    data,
    currentUserId,
    page,
    isInitialLoading,
    isFetchingMore,
    isError,
    consecutiveLoads,
  ]);

  const { getViewportElement, viewportElement } =
    useScrollAreaViewport<HTMLDivElement>(scrollAreaRef);
  const {
    virtualizedMessages,
    startOffset,
    endPadding,
    isVirtualized,
    visibleRange,
  } = useVirtualizedMessages({
    messages,
    viewportElement,
    overscan: 5,
  });

  useEffect(() => {
    if (!viewportElement) {
      console.log("Waiting for viewport element to be available");
      return;
    }

    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout | null = null;
    let debounceTimeout: NodeJS.Timeout | null = null;
    let lastScrollTop = viewportElement.scrollTop;

    const handleScrollEvent = () => {
      if (isScrolling) return;
      isScrolling = true;

      const currentScrollTop = viewportElement.scrollTop;

      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      debounceTimeout = setTimeout(() => {
        const isScrollingUp = currentScrollTop < lastScrollTop;
        const now = Date.now();
        const timeSinceLastLoad = now - lastLoadTimestamp;

        const isTooManyConsecutiveLoads = consecutiveLoads >= 3;
        const isLoadingTooQuickly =
          timeSinceLastLoad < 500 && consecutiveLoads > 0;

        if (
          isScrollingUp &&
          currentScrollTop < 100 &&
          !isLoading &&
          !isFetchingMore &&
          hasMore &&
          !isTooManyConsecutiveLoads &&
          !isLoadingTooQuickly
        ) {
          console.log("Near top and scrolling up, loading more messages...", {
            consecutiveLoads,
            timeSinceLastLoad,
          });

          setIsFetchingMore(true);
          setLastLoadTimestamp(now);
          setConsecutiveLoads((prev) => prev + 1);

          const oldScrollHeight = viewportElement.scrollHeight;
          const oldScrollTop = viewportElement.scrollTop;

          setPage((prev) => prev + 1);

          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
          }

          scrollTimeout = setTimeout(() => {
            if (viewportElement) {
              try {
                const newScrollHeight = viewportElement.scrollHeight;
                const heightDifference = newScrollHeight - oldScrollHeight;
                const newScrollTop = oldScrollTop + heightDifference;

                viewportElement.scrollTop = newScrollTop;

                console.log("Scroll position adjusted after loading", {
                  oldScrollHeight,
                  newScrollHeight,
                  heightDifference,
                  oldScrollTop,
                  newScrollTop,
                });
              } catch (error) {
                console.error("Error restoring scroll position:", error);
              }
            }
          }, 300);
        } else if (currentScrollTop > 300) {
          setConsecutiveLoads(0);
        }

        lastScrollTop = currentScrollTop;
      }, 200);

      setTimeout(() => {
        isScrolling = false;
      }, 100);
    };

    viewportElement.addEventListener("scroll", handleScrollEvent, {
      passive: true,
    });

    console.log("Scroll listener added to viewport element", {
      hasMore,
      page,
      viewportFound: !!viewportElement,
    });

    return () => {
      viewportElement.removeEventListener("scroll", handleScrollEvent);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [
    viewportElement,
    hasMore,
    isLoading,
    isFetchingMore,
    page,
    lastLoadTimestamp,
    consecutiveLoads,
  ]);

  const scrollToBottom = (force = false) => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const performScroll = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: force ? "auto" : "smooth",
          block: "end",
        });
        return;
      }

      // Fallback: Scroll viewport to bottom
      if (viewportElement) {
        viewportElement.scrollTo({
          top: viewportElement.scrollHeight,
          behavior: force ? "auto" : "smooth",
        });
        return;
      }

      // Last resort: Find viewport element manually
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]"
        );
        if (viewport instanceof HTMLElement) {
          viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: force ? "auto" : "smooth",
          });
        }
      }
    };

    // For force scrolling, execute immediately
    if (force) {
      performScroll();
      return;
    }

    // For smooth scrolling, add a small delay to ensure DOM is ready
    scrollTimeoutRef.current = setTimeout(performScroll, 50);
  };
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current && page === 1) {
      prevMessagesLengthRef.current = messages.length;

      // Auto-scroll if user is near the bottom (within 200px)
      if (viewportElement) {
        const distanceFromBottom =
          viewportElement.scrollHeight -
          viewportElement.scrollTop -
          viewportElement.clientHeight;

        if (distanceFromBottom <= 200) {
          // User is near bottom, auto-scroll with a small delay
          setTimeout(() => scrollToBottom(false), 100);
        }
      }
    }
  }, [messages.length, page, viewportElement]);
  useEffect(() => {
    // Auto-scroll to bottom for initial load or when new messages arrive
    if (page === 1 && !isFetchingMore && messages.length > 0) {
      setTimeout(() => scrollToBottom(false), 100);
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages, page, isFetchingMore]);
  // Simplified typing indicator scroll
  useEffect(() => {
    if (isTyping && page === 1) {
      setTimeout(() => scrollToBottom(false), 100);
    }
  }, [isTyping, page]);

  const onDeleteChat = async (id: string) => {
    try {
      mutateDeleteChat(id, {
        onSuccess: () => {
          chatsRevalidate();
          revalidate();
          setTimeout(() => {
            router.push("/chats");
          }, 500);
        },
      });
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="w-full h-full rounded-b-xl overflow-hidden relative"
    >
      {" "}
      {/* Admin Actions Header */}
      {session?.user.role === "admin" && (
        <div className="absolute z-30 top-0 end-0 start-0 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between p-1">
            {" "}
            <div className="flex items-center gap-2">
              <AdminStatus chatId={chatId} />
              <WebSocketStatusIndicator
                status={wsConnectionStatus}
                showText={true}
                className="text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <AssignPackageDialog chatId={chatId} />
              <ChatDeleteDialog
                onDeleteChat={onDeleteChat}
                chatId={chatId}
              />
            </div>
          </div>
        </div>
      )}
      <div
        className={cn(
          `w-full h-full justify-between`,
          session?.user.role == "admin"
            ? "grid grid-cols-1 md:grid-cols-6 pt-8"
            : "grid grid-cols-1"
        )}
      >
        <div
          className={cn(
            `w-full h-full flex flex-col col-span-2 justify-between items-center`,
            session?.user.role == "admin"
              ? "col-span-1 md:col-span-4 pt-4"
              : "col-span-1"
          )}
        >
          <ScrollArea
            className="h-[70dvh] w-full pe-4 px-4 overflow-y-auto"
            ref={scrollAreaRef}
            data-test-id="chat-scroll-area"
          >
            <div className="w-full pt-4">
              {hasMore && (
                <div className="mb-2">
                  <LoadingIndicator
                    isSmall={true}
                    className={
                      isFetchingMore
                        ? "opacity-100"
                        : "opacity-0 h-0 overflow-hidden"
                    }
                  />
                </div>
              )}

              {isError && page > 1 && (
                <LoadError
                  onRetry={() => {
                    setIsFetchingMore(true);
                    retryLoading(page);
                  }}
                  isInfiniteScroll={true}
                />
              )}

              {!hasMore && messages.length > 0 && !isInitialLoading && (
                <EndOfHistoryIndicator />
              )}

              {isInitialLoading ? (
                <MessageSkeletonGroup count={6} />
              ) : isError && messages.length === 0 ? (
                <LoadError
                  onRetry={() => {
                    retryLoading(1);
                  }}
                />
              ) : messages.length === 0 ? (
                <ChatEmptyState />
              ) : isVirtualized ? (
                <>
                  {startOffset > 0 && (
                    <div
                      style={{ height: startOffset + "px" }}
                      aria-hidden="true"
                    />
                  )}

                  {virtualizedMessages.map((msg, index) => (
                    <MemoizedMessagesArea
                      role={session?.user.role || "client"}
                      name={session?.user.name || ""}
                      key={msg.id}
                      message={msg}
                      previousMessage={
                        index > 0 ? virtualizedMessages[index - 1] : undefined
                      }
                      appearAnimation={false}
                    />
                  ))}

                  {endPadding > 0 && (
                    <div
                      style={{ height: endPadding + "px" }}
                      aria-hidden="true"
                    />
                  )}
                </>
              ) : (
                messages.map((msg, index) => (
                  <MemoizedMessagesArea
                    role={session?.user.role || "client"}
                    name={session?.user.name || ""}
                    key={msg.id}
                    message={msg}
                    previousMessage={
                      index > 0 ? messages[index - 1] : undefined
                    }
                    appearAnimation={page === 1 || index < messages.length - 5}
                    // scrollIntoView prop is not supported, managed by useEffect instead
                  />
                ))
              )}

              {isTyping && !isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm pl-12 animate-in fade-in-50">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t("messageArea.typing")}</span>
                </div>
              )}

              {/* Enhanced scroll target with padding for better scrolling */}
              <div
                ref={messagesEndRef}
                className="h-4 w-full"
                aria-hidden="true"
              />
            </div>
          </ScrollArea>{" "}
          <div className="flex w-full items-center gap-2 justify-between p-2 rounded-t-xl border-t">
            {isLoading ? (
              <div className="flex w-full gap-2 items-center">
                <div className="h-10 flex-1 rounded bg-muted-foreground/20 shimmer animate-pulse" />
                <div className="h-10 w-10 rounded bg-muted-foreground/20 shimmer animate-pulse" />
              </div>
            ) : (
              <>
                <MessageComposer
                  className="w-full"
                  chatId={chatId}
                  senderId={session?.user?.id || 0}
                  clientId={clientId || undefined}
                  page={page}
                  disabled={wsConnectionStatus === "disconnected"}
                  placeholder={t("messageArea.placeholder")}
                />{" "}
                {/* WebSocket status for non-admin users */}
                {session?.user.role !== "admin" && (
                  <WebSocketStatusIndicator
                    status={wsConnectionStatus}
                    showText={false}
                    className="text-xs shrink-0"
                  />
                )}
              </>
            )}
          </div>
        </div>
        {session?.user.role == "admin" && (
          <div
            className={cn(
              `hidden md:flex flex-col gap-4 w-full items-start px-4 py-2 rounded-t-xl bg-muted/30 border-l`,
              session?.user.role == "admin"
                ? "col-span-1 md:col-span-2"
                : "col-span-1"
            )}
          >
            {session?.user.role === "admin" && (
              <>
                <ScrollArea className="h-[75dvh] w-full py-4">
                  <div className="w-full">
                    <ManageClientLimits chatId={chatId} />
                  </div>
                </ScrollArea>
              </>
            )}
          </div>
        )}
      </div>{" "}
      <ScrollToBottomButton
        scrollAreaRef={scrollAreaRef}
        onClick={scrollToBottom}
      />
    </div>
  );
}
