"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useGlobalWebSocket } from "@/components/providers/websocket-provider";
import { WebSocketStatusIndicator } from "@/components/ui/websocket-status-indicator";
import { Activity, Trash2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface WebSocketMessage {
  id: string;
  timestamp: Date;
  type: "sent" | "received" | "system";
  data: any;
}

interface WebSocketDebugPanelProps {
  className?: string;
  maxMessages?: number;
}

export function WebSocketDebugPanel({
  className,
  maxMessages = 50,
}: WebSocketDebugPanelProps) {
  const { globalWs, globalStatus } = useGlobalWebSocket();
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [testMessage, setTestMessage] = useState('{"event":"ping"}');

  useEffect(() => {
    if (!globalWs) return;

    // Store original onMessage to avoid conflicts
    const originalOnMessage = globalWs.sendMessage;

    // Listen for messages (this is a simplified approach)
    // In a real implementation, you'd need to modify the WebSocket hook
    // to support multiple message listeners

    return () => {
      // Cleanup if needed
    };
  }, [globalWs, maxMessages]);

  const addMessage = (type: WebSocketMessage["type"], data: any) => {
    const message: WebSocketMessage = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      data,
    };

    setMessages((prev) => {
      const newMessages = [message, ...prev];
      return newMessages.slice(0, maxMessages);
    });
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const sendTestMessage = () => {
    try {
      const parsed = JSON.parse(testMessage);
      globalWs?.sendMessage(parsed);
      addMessage("sent", parsed);
    } catch (error) {
      console.error("Invalid JSON:", error);
      addMessage("system", { error: "Invalid JSON format" });
    }
  };

  const formatMessage = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  const getMessageTypeColor = (type: WebSocketMessage["type"]) => {
    switch (type) {
      case "sent":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "received":
        return "bg-green-100 text-green-800 border-green-200";
      case "system":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (process.env.NODE_ENV === "production") {
    return null; // Don't show in production
  }

  return (
    <Card className={cn("w-full max-w-2xl", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            WebSocket Debug Panel
          </CardTitle>
          <WebSocketStatusIndicator
            status={globalStatus}
            showText={true}
            onRetry={globalWs?.reconnect}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Test Message Sender */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Send Test Message:</label>
          <div className="flex gap-2">
            <textarea
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="flex-1 min-h-[60px] px-3 py-2 text-sm border rounded-md resize-none"
              placeholder="Enter JSON message..."
            />
            <Button
              onClick={sendTestMessage}
              size="sm"
              disabled={globalStatus !== "connected"}
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Messages List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Messages ({messages.length}/{maxMessages})
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={clearMessages}
              disabled={messages.length === 0}
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>

          <ScrollArea className="h-[400px] border rounded-md">
            <div className="p-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No messages yet. Connect to see WebSocket activity.
                </p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className="space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={getMessageTypeColor(message.type)}
                      >
                        {message.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                      {formatMessage(message.data)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
