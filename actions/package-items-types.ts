"use server";

import { Auth } from "@/hooks/auth";

export async function createPackageItemType({ name }: { name: string }) {
  try {
    const session = await Auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const apiBaseUrl = process.env.API_APP_URL;

    if (!apiBaseUrl) {
      throw new Error("API base URL not set");
    }

    const res = await fetch(`${apiBaseUrl}/api/item-types/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error("Failed to create package item type", { cause: data });
    }

    return data;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to create package item type");
  }
}
