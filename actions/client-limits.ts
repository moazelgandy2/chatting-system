"use server";

import { Auth } from "@/hooks/auth";

export interface ClientLimitData {
  client_id: number;
  client_package_id: number;
  item_type: string;
  edit_limit: number;
  decline_limit: number;
}

export const storeClientLimits = async (data: ClientLimitData) => {
  try {
    const session = await Auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const apiBaseUrl = process.env.API_APP_URL;
    if (!apiBaseUrl) {
      throw new Error("API base URL not set");
    }

    const res = await fetch(`${apiBaseUrl}/api/client-limits/store`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw new Error("Failed to store client limits", { cause: responseData });
    }

    return responseData;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to store client limits");
  }
};
