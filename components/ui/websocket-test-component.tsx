"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useChatWebSocket } from "@/hooks/use-chat-websocket";
import { useWebSocketHealth } from "@/hooks/use-websocket-health";
import { WebSocketStatusIndicator } from "@/components/ui/websocket-status-indicator";
import { ChatWebSocketManager } from "@/components/ui/chat-websocket-manager";

interface WebSocketTestComponentProps {
  chatId?: string;
}

export function WebSocketTestComponent({
  chatId = "test-chat-123",
}: WebSocketTestComponentProps) {
  const [enabled, setEnabled] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const { status, reconnect, close } = useChatWebSocket({
    chatId,
    enabled,
    showNotifications,
  });

  const { health } = useWebSocketHealth({
    status,
    onHealthChange: (newHealth) => {
      console.log("WebSocket health updated:", newHealth);
    },
  });

  const formatUptime = (uptime: number) => {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">WebSocket Components Test</h1>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
            <Label htmlFor="enabled">Enable WebSocket Connection</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="notifications"
              checked={showNotifications}
              onCheckedChange={setShowNotifications}
            />
            <Label htmlFor="notifications">Show Toast Notifications</Label>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={reconnect}
              variant="outline"
              size="sm"
            >
              Reconnect
            </Button>
            <Button
              onClick={close}
              variant="outline"
              size="sm"
            >
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Connection Status
            <WebSocketStatusIndicator
              status={status}
              showText={true}
              onRetry={reconnect}
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <Badge
                variant={
                  status === "connected"
                    ? "default"
                    : status === "connecting"
                    ? "secondary"
                    : "destructive"
                }
                className="block text-center mt-1"
              >
                {status.toUpperCase()}
              </Badge>
            </div>

            <div>
              <Label className="text-sm font-medium">Chat ID</Label>
              <p className="text-sm text-muted-foreground mt-1">{chatId}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">Health</Label>
              <Badge
                variant={health.isHealthy ? "default" : "destructive"}
                className="block text-center mt-1"
              >
                {health.isHealthy ? "HEALTHY" : "UNHEALTHY"}
              </Badge>
            </div>

            <div>
              <Label className="text-sm font-medium">Notifications</Label>
              <Badge
                variant={showNotifications ? "default" : "secondary"}
                className="block text-center mt-1"
              >
                {showNotifications ? "ENABLED" : "DISABLED"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Health Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">Connection Uptime</Label>
              <p className="text-lg font-mono mt-1">
                {health.connectionUptime > 0
                  ? formatUptime(health.connectionUptime)
                  : "-"}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">Latency</Label>
              <p className="text-lg font-mono mt-1">
                {health.latency !== null ? `${health.latency}ms` : "-"}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">Reconnect Count</Label>
              <p className="text-lg font-mono mt-1">{health.reconnectCount}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">Messages Sent</Label>
              <p className="text-lg font-mono mt-1">{health.messagesSent}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">Messages Received</Label>
              <p className="text-lg font-mono mt-1">
                {health.messagesReceived}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">Last Message</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {health.lastMessageTime
                  ? health.lastMessageTime.toLocaleTimeString()
                  : "None"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manager Component Demo */}
      <Card>
        <CardHeader>
          <CardTitle>WebSocket Manager Component</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">
                Basic Status Indicator
              </Label>
              <div className="mt-2">
                <ChatWebSocketManager
                  chatId={chatId}
                  enabled={enabled}
                  showStatusIndicator={true}
                  statusIndicatorProps={{
                    showText: true,
                  }}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Icon Only</Label>
              <div className="mt-2">
                <ChatWebSocketManager
                  chatId={chatId}
                  enabled={enabled}
                  showStatusIndicator={true}
                  statusIndicatorProps={{
                    showText: false,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Test Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            1. Toggle the "Enable WebSocket Connection" switch to test
            connection/disconnection
          </p>
          <p>
            2. Enable notifications to see toast messages for connection status
            changes
          </p>
          <p>3. Use the Reconnect button to manually trigger a reconnection</p>
          <p>4. Use the Disconnect button to manually close the connection</p>
          <p>5. Watch the health metrics update in real-time</p>
          <p>6. Check the browser console for detailed WebSocket logs</p>
        </CardContent>
      </Card>
    </div>
  );
}
