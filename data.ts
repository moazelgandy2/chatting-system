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

import { Package } from "./types";

export const mockPackage: Package = {
  id: "pkg-001",
  name: "Q2 Content Package",
  status: "active",
  startDate: "2025-01-01",
  endDate: "2025-06-30",
  clientName: "Acme Corporation",
  items: [
    {
      id: "item-001",
      type: "Post",
      icon: "image",
      totalAllowed: 30,
      used: 18,
      description: "Social media posts for Instagram and Facebook",
      submissions: [
        {
          id: "sub-001",
          title: "Summer Collection Launch",
          status: "accepted",
          dateSubmitted: "2025-01-15",
          thumbnailUrl: "/placeholder.svg",
          description:
            "Announcing the launch of our summer collection with lifestyle imagery.",
        },
        {
          id: "sub-002",
          title: "Product Showcase",
          status: "rejected",
          dateSubmitted: "2025-01-22",
          thumbnailUrl: "/placeholder.svg",
          description: "Individual product highlights with detailed features.",
        },
        {
          id: "sub-003",
          title: "Customer Testimonial",
          status: "edited",
          dateSubmitted: "2025-02-01",
          thumbnailUrl: "/placeholder.svg",
          description: "Sharing positive feedback from satisfied customers.",
        },
        {
          id: "sub-004",
          title: "Behind the Scenes",
          status: "accepted",
          dateSubmitted: "2025-02-10",
          thumbnailUrl: "/placeholder.svg",
          description: "Showing the creative process and team collaboration.",
        },
        {
          id: "sub-005",
          title: "Product Tips & Tricks",
          status: "pending",
          dateSubmitted: "2025-03-05",
          thumbnailUrl: "/placeholder.svg",
          description: "Helpful ways to use our products effectively.",
        },
      ],
    },
    {
      id: "item-002",
      type: "Story",
      icon: "book-open",
      totalAllowed: 20,
      used: 8,
      description: "Instagram and Facebook stories",
      submissions: [
        {
          id: "sub-006",
          title: "Quick Product Tour",
          status: "accepted",
          dateSubmitted: "2025-01-20",
          thumbnailUrl: "/placeholder.svg",
          description: "Brief showcase of product features in story format.",
        },
        {
          id: "sub-007",
          title: "Day in the Life",
          status: "edited",
          dateSubmitted: "2025-02-05",
          thumbnailUrl: "/placeholder.svg",
          description:
            "Following a customer using our products throughout their day.",
        },
        {
          id: "sub-008",
          title: "Limited Offer Alert",
          status: "rejected",
          dateSubmitted: "2025-02-18",
          thumbnailUrl: "/placeholder.svg",
          description: "Announcing a flash sale with countdown timer.",
        },
      ],
    },
    {
      id: "item-003",
      type: "Reel",
      icon: "film",
      totalAllowed: 10,
      used: 9,
      description: "Short-form video content for social media",
      submissions: [
        {
          id: "sub-009",
          title: "Product Unboxing",
          status: "accepted",
          dateSubmitted: "2025-01-25",
          thumbnailUrl: "/placeholder.svg",
          description: "Exciting unboxing experience showcasing packaging.",
        },
        {
          id: "sub-010",
          title: "Tutorial Series",
          status: "accepted",
          dateSubmitted: "2025-02-08",
          thumbnailUrl: "/placeholder.svg",
          description: "How-to guide for getting the most out of products.",
        },
      ],
    },
    {
      id: "item-004",
      type: "Design",
      icon: "palette",
      totalAllowed: 15,
      used: 3,
      description: "Custom graphics and visual designs",
      submissions: [
        {
          id: "sub-011",
          title: "Brand Style Refresh",
          status: "edited",
          dateSubmitted: "2025-01-30",
          thumbnailUrl: "/placeholder.svg",
          description: "Updated visual identity elements and guidelines.",
        },
        {
          id: "sub-012",
          title: "Product Packaging",
          status: "accepted",
          dateSubmitted: "2025-02-15",
          thumbnailUrl: "/placeholder.svg",
          description: "New packaging concepts for the summer line.",
        },
        {
          id: "sub-013",
          title: "Social Media Templates",
          status: "rejected",
          dateSubmitted: "2025-03-01",
          thumbnailUrl: "/placeholder.svg",
          description: "Consistent templates for various social platforms.",
        },
      ],
    },
  ],
};
