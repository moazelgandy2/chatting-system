"use server";

import { Auth } from "@/hooks/auth";

export const getClientPackageItem = async (
  packageId: number,
  packageItemId: number
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
      `${apiBaseUrl}/api/client-package-items/${packageId}/${packageItemId}`,
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
      throw new Error("Failed to fetch client package item", { cause: data });
    }

    return data;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to get client package item");
  }
};
