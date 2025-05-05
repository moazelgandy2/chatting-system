import {
  GalleryHorizontalEnd,
  ImageIcon,
  LifeBuoy,
  MessageSquare,
  UserIcon,
} from "lucide-react";

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
          { icon: UserIcon, title: "Chat 1", url: "/chats/1" },
          {
            icon: UserIcon,
            title: "Chat 2",
            url: "/chats/2",
          },
          {
            icon: UserIcon,
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
            icon: GalleryHorizontalEnd,
            title: "Package 1",
            url: "/packages/1",
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
