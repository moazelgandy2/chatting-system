"use server";

import { Auth } from "@/hooks/auth";

export const fetchAdminChats = async () => {
  const session = await Auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (session.user.role != "admin") {
    return [];
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

export interface SendMessageWithFilesData {
  senderId: string;
  message: string;
  media?: File[];
  item_type?: string;
  package_item_id?: string;
  client_package_id?: string;
  IsItem?: string;
}

export const sendMessageWithFiles = async (
  chatId: string,
  data: SendMessageWithFilesData
) => {
  const session = await Auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const apiBaseUrl = process.env.API_APP_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL not set");
  }

  const formData = new FormData();
  formData.append("senderId", data.senderId);
  formData.append("message", data.message);

  // Add media files if provided
  if (data.media && data.media.length > 0) {
    data.media.forEach((file) => {
      formData.append("media[]", file);
    });
  }

  console.log("formData from sendMessageWithFiles=>", formData);
  console.log("data from sendMessageWithFiles=>", data);

  // Add package item data if provided
  if (data.item_type) {
    formData.append("item_type", data.item_type);
  }
  if (data.package_item_id) {
    console.log(
      "package_item_id from sendMessageWithFiles=>",
      data.package_item_id
    );
    formData.append("package_item_id", data.package_item_id);
  } else {
    console.log("package_item_id is not provided in sendMessageWithFiles");
  }
  if (data.client_package_id) {
    formData.append("client_package_id", data.client_package_id);
  }
  if (data.IsItem) {
    formData.append("IsItem", data.IsItem);
  }

  const res = await fetch(`${apiBaseUrl}/api/chats/${chatId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
    body: formData,
  });

  const responseData = await res.json();
  console.log("responseData from sendMessageWithFiles=>", responseData);
  if (!res.ok) {
    throw new Error("Failed to send message", { cause: responseData });
  }
  return responseData;
};

export const createChat = async ({
  client_id,
  name,
  description,
}: {
  client_id: number;
  name: string;
  description: string;
}) => {
  const session = await Auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  if (session.user.role != "admin") {
    throw new Error("Unauthorized");
  }
  const apiBaseUrl = process.env.API_APP_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL not set");
  }
  const response = await fetch(`${apiBaseUrl}/api/chats`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ client_id, name, description }),
  });
  const data = await response.json();
  console.log("CHAT CREATE", data);
  if (!response.ok) {
    const error = new Error(data.message || "Failed to create chat");
    error.name = "CreateChatError";
    throw error;
  }
  return data;
};

export const assignTeamToChat = async ({
  chatId,
  team_ids,
}: {
  chatId: number;
  team_ids: number[];
}) => {
  const session = await Auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  if (session.user.role != "admin") {
    throw new Error("Unauthorized");
  }
  const apiBaseUrl = process.env.API_APP_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL not set");
  }
  const response = await fetch(
    `${apiBaseUrl}/api/chats/${chatId}/assign-team`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ team_ids }),
    }
  );
  const data = await response.json();
  console.log("DATA=>", data);
  if (!response.ok) {
    const error = new Error(data.message || "Failed to assign team");
    error.name = "AssignTeamError";
    throw error;
  }
  return data;
};

export const deleteChat = async (chatId: string) => {
  const session = await Auth();
  if (!session) {
    throw new Error("User not authenticated");
  }
  if (session.user.role != "admin") {
    throw new Error("Unauthorized");
  }
  const apiBaseUrl = process.env.API_APP_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL not configured");
  }
  const res = await fetch(`${apiBaseUrl}/api/chats/${chatId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to delete chat");
  }
  // Assuming the API returns a success message or no content on successful deletion
  if (res.status === 204) {
    return { message: "Chat deleted successfully" };
  }
  return await res.json();
};
