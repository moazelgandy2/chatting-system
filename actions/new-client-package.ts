"use server";

import { Auth } from "@/hooks/auth";

/**
 * Fetch client package data using the new API endpoint
 * This provides client package data with proper type mapping
 */
export const getNewClientPackage = async (packageId: string) => {
  try {
    const session = await Auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const apiBaseUrl = process.env.API_APP_URL;
    if (!apiBaseUrl) {
      throw new Error("API base URL not set");
    }

    const url = `${apiBaseUrl}/api/client-package/${packageId}`;
    console.log("Fetching client package from:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Client package response status:", res.status);
    console.log(
      "Client package response headers:",
      Object.fromEntries(res.headers.entries())
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Client package API error response:", errorText);
      throw new Error(
        `Failed to fetch client package: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    console.log("Client package data received:", data);

    return data;
  } catch (e) {
    console.error("Error in getNewClientPackage:", e);
    throw new Error(
      `Failed to get client package: ${
        e instanceof Error ? e.message : String(e)
      }`
    );
  }
};

/**
 * Fetch item types with IDs using the new API endpoint
 * This provides item types that can be mapped to package items by type_id
 */
export const getNewItemTypes = async () => {
  try {
    const session = await Auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const apiBaseUrl = process.env.API_APP_URL;
    if (!apiBaseUrl) {
      throw new Error("API base URL not set");
    }

    const url = `${apiBaseUrl}/api/item-types`;
    console.log("Fetching item types from:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Item types response status:", res.status);
    console.log(
      "Item types response headers:",
      Object.fromEntries(res.headers.entries())
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Item types API error response:", errorText);
      throw new Error(
        `Failed to fetch item types: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    console.log("Item types data received:", data);

    return data;
  } catch (e) {
    console.error("Error in getNewItemTypes:", e);
    throw new Error(
      `Failed to get item types: ${e instanceof Error ? e.message : String(e)}`
    );
  }
};
