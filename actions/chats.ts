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

export const sendMessage = async (chatId: string, message: string) => {
  const session = await Auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const apiBaseUrl = process.env.API_APP_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL not set");
  }
  const res = await fetch(`${apiBaseUrl}/api/chats/${chatId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ senderId: session.user.id, message }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error("Failed to send message", { cause: data });
  }
  return data;
};
