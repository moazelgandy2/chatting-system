import { cn } from "@/lib/utils";
import { WebSocketStatus } from "@/hooks/use-websocket";
import { Wifi, WifiOff, Loader2 } from "lucide-react";

interface WebSocketStatusIndicatorProps {
  status: WebSocketStatus;
  className?: string;
  showText?: boolean;
  onRetry?: () => void;
}

export function WebSocketStatusIndicator({
  status,
  className,
  showText = false,
  onRetry,
}: WebSocketStatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          icon: Wifi,
          color: "text-green-500",
          text: "Connected",
          bgColor: "bg-green-500/20",
        };
      case "connecting":
        return {
          icon: Loader2,
          color: "text-yellow-500",
          text: "Connecting...",
          bgColor: "bg-yellow-500/20",
          animate: true,
        };
      case "disconnected":
        return {
          icon: WifiOff,
          color: "text-red-500",
          text: "Disconnected",
          bgColor: "bg-red-500/20",
        };
      default:
        return {
          icon: WifiOff,
          color: "text-gray-500",
          text: "Unknown",
          bgColor: "bg-gray-500/20",
        };
    }
  };

  const { icon: Icon, color, text, bgColor, animate } = getStatusConfig();

  const handleClick = () => {
    if (status === "disconnected" && onRetry) {
      onRetry();
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-1 rounded-md transition-colors",
        bgColor,
        status === "disconnected" &&
          onRetry &&
          "cursor-pointer hover:opacity-80",
        className
      )}
      onClick={handleClick}
      title={
        status === "disconnected" && onRetry
          ? "Click to retry connection"
          : text
      }
    >
      <Icon className={cn("h-4 w-4", color, animate && "animate-spin")} />
      {showText && (
        <span className={cn("text-xs font-medium", color)}>{text}</span>
      )}
    </div>
  );
}
