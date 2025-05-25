"use server";

import { Auth } from "@/hooks/auth";

export interface AssignPackageData {
  client_id: number;
  package_id: number;
  chat_id: number;
  status: "active" | "inactive";
}

export const getClientId = async (chatId: string) => {
  try {
    const session = await Auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const apiBaseUrl = process.env.API_APP_URL;
    if (!apiBaseUrl) {
      throw new Error("API base URL not set");
    }

    const res = await fetch(`${apiBaseUrl}/api/chat/user/${chatId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error("Failed to fetch client ID", { cause: data });
    }

    console.log("Fetched client ID:", data);

    return data.data.client_id;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get client ID");
  }
};

export const assignPackage = async (data: AssignPackageData) => {
  try {
    const session = await Auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const apiBaseUrl = process.env.API_APP_URL;
    if (!apiBaseUrl) {
      throw new Error("API base URL not set");
    }
    const clientId = await getClientId(data.chat_id.toString());
    if (!clientId) {
      console.log(clientId, data);
      throw new Error("Client ID not found for the given chat");
    }

    const res = await fetch(`${apiBaseUrl}/api/client-package`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        client_id: clientId,
      }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error("Failed to assign package", { cause: responseData });
    }

    return responseData;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to assign package");
  }
};

export const getAssignedPackages = async (chatId: string) => {
  try {
    const session = await Auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const apiBaseUrl = process.env.API_APP_URL;
    if (!apiBaseUrl) {
      throw new Error("API base URL not set");
    }

    const res = await fetch(
      `${apiBaseUrl}/api/client-package/showbychat/${chatId}`,
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
      throw new Error("Failed to fetch assigned packages", { cause: data });
    }

    return data;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get assigned packages");
  }
};

export const getDetailedClientPackage = async (clientPackageId: number) => {
  try {
    const session = await Auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const apiBaseUrl = process.env.API_APP_URL;
    if (!apiBaseUrl) {
      throw new Error("API base URL not set");
    }

    const res = await fetch(
      `${apiBaseUrl}/api/client-package/${clientPackageId}`,
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
      throw new Error("Failed to fetch detailed client package", {
        cause: data,
      });
    }

    return data;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get detailed client package");
  }
};

export const updateClientPackageItemStatus = async (
  clientPackageItemId: number,
  status: "pending" | "in_progress" | "completed" | "declined" | "delivered",
  notes?: string
) => {
  try {
    const session = await Auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const apiBaseUrl = process.env.API_APP_URL;
    if (!apiBaseUrl) {
      throw new Error("API base URL not set");
    }

    const res = await fetch(
      `${apiBaseUrl}/api/client-package-item/${clientPackageItemId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          notes,
          delivered_at:
            status === "delivered" ? new Date().toISOString() : null,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error("Failed to update client package item status", {
        cause: data,
      });
    }

    return data;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to update client package item status");
  }
};
