"use server";

import { Auth } from "@/hooks/auth";

// Define the expected structure of a single limit item
export interface ClientRemainingLimitItem {
  id: number | null;
  client_id: number | null;
  client_package_id: number | null;
  client_package_item_id: number | null;
  item_type: string | null;
  edit_limit: number | null;
  decline_limit: number | null;
  created_at: string | null;
  updated_at: string | null;
}

// Define the expected API response structure
export interface ClientRemainingLimitsResponse
  extends Array<ClientRemainingLimitItem> {}

const baseUrl = process.env.API_APP_URL || "";

// Function to fetch client remaining limits
export const fetchClientRemainingLimitsAction = async (
  chatId: string
): Promise<ClientRemainingLimitsResponse> => {
  if (!baseUrl) {
    throw new Error("API base URL is not configured.");
  }
  const session = await Auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const token = session.token; // Assuming Auth returns a session with a token
  const response = await fetch(
    `${baseUrl}/api/client-limits/remaining-limits/${chatId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  console.log("Fetched remaining limits:", data);
  if (!response.ok) {
    console.error("Failed to fetch remaining limits:", response);
    let errorDetails = "Failed to fetch remaining limits";
    try {
      const errorData = await response.json();
      errorDetails = errorData.message || errorDetails;
    } catch (e) {
      // Ignore if parsing error body fails
    }
    throw new Error(
      `Network response was not ok: ${response.status} ${response.statusText} - ${errorDetails}`
    );
  }

  let filteredData: ClientRemainingLimitsResponse =
    data as ClientRemainingLimitsResponse;
  filteredData = filteredData.filter((item) => item.id != null);

  return filteredData;
};

/*
[
    {
        "id": 31,
        "client_id": 2,
        "client_package_id": 21,
        "client_package_item_id": null,
        "item_type": "Videos",
        "edit_limit": 2,
        "decline_limit": 3,
        "created_at": "2025-06-16T09:13:18.000000Z",
        "updated_at": "2025-06-16T09:13:18.000000Z"
    },
    {
        "id": null,
        "client_id": null,
        "client_package_id": null,
        "client_package_item_id": null,
        "item_type": null,
        "edit_limit": null,
        "decline_limit": null,
        "created_at": null,
        "updated_at": null
    },
    {
        "id": null,
        "client_id": null,
        "client_package_id": null,
        "client_package_item_id": null,
        "item_type": null,
        "edit_limit": null,
        "decline_limit": null,
        "created_at": null,
        "updated_at": null
    },
    {
        "id": null,
        "client_id": null,
        "client_package_id": null,
        "client_package_item_id": null,
        "item_type": null,
        "edit_limit": null,
        "decline_limit": null,
        "created_at": null,
        "updated_at": null
    }
]

*/
