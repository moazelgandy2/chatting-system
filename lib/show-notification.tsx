import { toast } from "sonner";
import Notification from "@/components/kokonutui/notification";

export function showNotification(
  message: string,
  type: "success" | "error" | "info" = "info"
) {
  toast.custom(() => (
    <Notification
      message={message}
      type={type}
    />
  ));
}
