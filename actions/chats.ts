"use server";

import { Auth } from "@/hooks/auth";

export const fetchChats = async () => {
  const session = await Auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const apiBaseUrl = process.env.API_APP_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL not set");
  }

  const res = await fetch(`${apiBaseUrl}/api/chats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to fetch chats", { cause: data });
  }

  console.log("Fetched chats:", data);

  return data;
};

export const fetchChat = async (chatId: string, page: number = 1) => {
  const session = await Auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const apiBaseUrl = process.env.API_APP_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL not set");
  }

  const res = await fetch(
    `${apiBaseUrl}/api/chats/${chatId}/messages?page=${page}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to fetch chats", { cause: data });
  }

  console.log("Fetched package:", data);

  return data;
};
