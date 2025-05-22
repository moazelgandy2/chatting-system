"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendIcon, Loader2, Trash2Icon, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import Card05 from "./_components/quota-details-card";
import { MemoizedMessagesArea, MessageType } from "./_components/messages-area";
import {
  useChat,
  useChatRevalidate,
  useDeleteChat,
  useSendMessage,
} from "@/hooks/use-chat";
import { ChatMessage } from "@/types/chats";
import Link from "next/link";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useChatsRevalidate } from "@/hooks/use-chats";

const generateId = () =>
  `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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
  const [message, setMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [consecutiveLoads, setConsecutiveLoads] = useState(0);
  const [lastLoadTimestamp, setLastLoadTimestamp] = useState(0);

  // Define refs with proper TypeScript types
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevMessagesLengthRef = useRef<number>(0);

  const [wsConnectionStatus, setWsConnectionStatus] = useState<
    "connected" | "disconnected" | "connecting"
  >("connecting");
  const wsRef = useRef<WebSocket | null>(null);

  const { data, isLoading, isError, mutate } = useChat(chatId, page);
  const { mutate: mutateDeleteChat } = useDeleteChat();

  const { session } = useAuth();
  const currentUserId = session?.user?.id;
  const router = useRouter();
  const revalidate = useChatRevalidate(chatId);
  const chatsRevalidate = useChatsRevalidate();

  useEffect(() => {
    const ws = new WebSocket(`ws://ws.droplo.cloud/app/980e9rlf318lalrzdks4`);
    wsRef.current = ws;

    console.log("WebSocket connection established");

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      setWsConnectionStatus("connected");
      ws.send(
        JSON.stringify({
          event: "pusher:subscribe",
          data: {
            channel: `chat.${chatId}`,
          },
        })
      );
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setWsConnectionStatus("disconnected");
    };

    ws.onmessage = (event) => {
      console.log("WebSocket message received:", JSON.parse(event.data));
      console.log("Here");
      router.refresh();
      revalidate();
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(`{"event":"ping"}`);
      }
    }, 29000);

    return () => {
      clearInterval(pingInterval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const sendMessageMutation = useSendMessage(
    chatId,
    page,
    session?.user.id || 0
  );

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
      const mapped = data.data.data.map((msg: ChatMessage) => ({
        id: String(msg.id),
        content: msg.message,
        sender: (msg.sender_id === currentUserId ? "user" : "agent") as
          | "agent"
          | "user",
        senderName: msg.sender?.name,
        timestamp: new Date(msg.created_at),
      }));

      setMessages((prev) => {
        const ids = new Set(prev.map((m) => m.id));

        return page === 1
          ? mapped
          : [...mapped.filter((m) => !ids.has(m.id)), ...prev];
      });

      const currentPage = data.data.current_page;
      const lastPage = Math.ceil(data.data.total / data.data.per_page);
      const moreAvailable = currentPage < lastPage;

      console.log("Pagination info:", {
        currentPage,
        lastPage,
        total: data.data.total,
        perPage: data.data.per_page,
        hasMore: moreAvailable,
        messagesCount: mapped.length,
        viewportAvailable: !!viewportElement,
        isInitialLoading,
        isFetchingMore,
        page,
        consecutiveLoads,
      });

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

    console.log("Got viewport element:", viewportElement);

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

  const scrollToBottom = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (viewportElement) {
        console.log(
          "Scrolling to bottom using viewport element",
          viewportElement
        );
        viewportElement.scrollTop = viewportElement.scrollHeight;
      } else {
        console.error("Could not find viewport for scrolling to bottom");
      }
    }, 10);
  };

  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current && page === 1) {
      setHasNewMessages(true);

      prevMessagesLengthRef.current = messages.length;
    }
  }, [messages.length, page]);

  useEffect(() => {
    if ((page === 1 && !isFetchingMore) || hasNewMessages) {
      scrollToBottom();
      setHasNewMessages(false);
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages, isTyping, page, isFetchingMore, hasNewMessages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message, {
      onSuccess: () => {
        setMessage("");
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
      <div className="absolute z-30  end-2 flex items-center p-4">
        <AlertDialog>
          <AlertDialogTrigger>
            <Button className="bg-red-600 rounded-3xl hover:bg-red-700 cursor-pointer">
              <Trash2 className=" h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("package.available.confirmDelete")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("package.available.deleteWarning")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("package.available.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDeleteChat(chatId.toString())}
                className="bg-red-600 hover:bg-red-700"
              >
                {t("package.available.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 w-full h-full justify-between">
        <div className="w-full h-full col-span-1 md:col-span-4 flex flex-col justify-between items-center">
          <ScrollArea
            className="h-[75dvh] w-full pe-4 px-4 overflow-y-auto"
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
                    appearAnimation={page === 1 || index < messages.length - 5}
                  />
                ))
              )}

              {isTyping && !isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm pl-12 animate-in fade-in-50">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t("messageArea.typing")}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="flex w-full items-center gap-2 justify-between p-4 rounded-t-xl border-t">
            {isLoading ? (
              <div className="flex w-full gap-2 items-center">
                <div className="h-10 flex-1 rounded bg-muted-foreground/20 shimmer animate-pulse" />
                <div className="h-10 w-10 rounded bg-muted-foreground/20 shimmer animate-pulse" />
              </div>
            ) : (
              <>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("messageArea.placeholder")}
                  className="w-full"
                  disabled={
                    wsConnectionStatus === "disconnected" ||
                    sendMessageMutation.isPending
                  }
                />

                <Button
                  onClick={handleSendMessage}
                  variant="default"
                  size="icon"
                  disabled={
                    !message.trim() ||
                    sendMessageMutation.isPending ||
                    wsConnectionStatus === "disconnected"
                  }
                >
                  <SendIcon className="h-4 w-4" />
                  <span className="sr-only">{t("messageArea.send")}</span>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="hidden md:flex justify-end w-full col-span-2 items-start px-4 py-2 rounded-t-xl">
          <Card05 />
        </div>
      </div>

      <ScrollToBottomButton
        scrollAreaRef={scrollAreaRef}
        onClick={scrollToBottom}
        hasNewMessages={hasNewMessages}
      />
    </div>
  );
}
