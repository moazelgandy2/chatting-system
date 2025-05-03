import { ImageIcon, LifeBuoy, MessageSquare } from "lucide-react";

export const createData = (
  t: (key: string, params?: Record<string, any>) => string
) => {
  return {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: t("dashboard.navigation.chats"),
        url: "#",
        icon: MessageSquare,
        isActive: true,
        items: [
          {
            title: "Chat 1",
            url: "/chats/1",
          },
          {
            title: "Chat 2",
            url: "/chats/2",
          },
          {
            title: "Chat 3",
            url: "/chats/3",
          },
        ],
      },
      {
        title: t("dashboard.navigation.media"),
        url: "#",
        icon: ImageIcon,
        isActive: true,
        items: [
          {
            title: "Package 1",
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
    ],
  };
};
