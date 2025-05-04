"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendIcon, Loader2, CheckIcon, WifiOffIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState, useRef, useEffect } from "react";
import Card05 from "./quota-details-card";
import { MessagesArea, MessageType } from "./messages-area";

// Simple function to generate IDs
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
  const [connectionStatus, setConnectionStatus] = useState<
    "online" | "offline"
  >("online");

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log(
      `Loading chat history for chat ID: ${chatId} with locale: ${propLocale}`
    );

    const simulatedMessages: MessageType[] = [
      {
        id: generateId(),
        content: `Welcome to chat #${chatId}`,
        sender: "agent",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        id: generateId(),
        content: `How can I help you today?`,
        sender: "agent",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 1000), // 1 day ago + 1 second
      },
    ];

    setMessages(simulatedMessages);
  }, [chatId, propLocale]);

  const scrollToBottom = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "auto" });
      }
    }, 50);
  };

  useEffect(() => {
    scrollToBottom();
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const userMessage: MessageType = {
      id: generateId(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const agentMessage: MessageType = {
        id: generateId(),
        content: `Response to: ${message}`,
        sender: "agent",
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, agentMessage]);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const toggleConnection = () => {
      if (Math.random() > 0.8) {
        setConnectionStatus((prev) => {
          const newStatus = prev === "online" ? "offline" : "online";
          return newStatus;
        });
      }
    };

    const interval = setInterval(toggleConnection, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="w-full h-full rounded-b-xl overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-6 w-full h-full justify-between">
        <div className="w-full h-full col-span-1 md:col-span-4 flex flex-col justify-between items-center">
          <ScrollArea
            className="h-[75dvh] w-full pe-4 px-4"
            ref={scrollAreaRef}
          >
            <div className="w-full pt-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  {t("messageArea.emptyState")}
                </div>
              ) : (
                messages.map((msg) => (
                  <MessagesArea
                    key={msg.id}
                    message={msg}
                  />
                ))
              )}

              {isTyping && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm pl-12">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t("messageArea.typing")}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="flex w-full items-center gap-2 justify-between p-4 rounded-t-xl border-t">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("messageArea.placeholder")}
              className="w-full"
              disabled={connectionStatus === "offline"}
            />
            <Button
              onClick={handleSendMessage}
              variant="default"
              size="icon"
              disabled={
                !message.trim() || isTyping || connectionStatus === "offline"
              }
            >
              <SendIcon className="h-4 w-4" />
              <span className="sr-only">{t("messageArea.send")}</span>
            </Button>
          </div>
        </div>

        <div className="hidden md:flex justify-end w-full col-span-2 items-start px-4 py-2 rounded-t-xl">
          <Card05 />
        </div>
      </div>
    </div>
  );
}
