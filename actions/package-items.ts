"use server";
import { PackageItemFormType } from "@/forms/create-package-item.schema";
import { Auth } from "@/hooks/auth";

export async function getItemTypes() {
  const baseUrl = process.env.API_APP_URL;
  const session = await Auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const res = await fetch(`${baseUrl}/api/item-types`, {
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });

  console.log("res=>", res);
  const data = await res.json();
  if (!res.ok) {
    throw new Error("Failed to fetch item types");
  }
  console.log(data);

  return data;
}

export async function createPackageItem(data: PackageItemFormType) {
  const baseUrl = process.env.API_APP_URL;
  const session = await Auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const res = await fetch(`${baseUrl}/api/package-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify(data),
  });
  console.log("res from createPackage=>", res);
  const resData = await res.json();

  if (!res.ok) {
    throw new Error(resData.message || "Failed to create package item");
  }
  try {
    await storePackageAllowedItems({
      package_item_id: resData.data.id,
      allowed_count: +data.allowed_count,
    });
  } catch (e) {
    console.log("Error storing package allowed items", e);
    deletePackageItem(resData.data.id);
    throw new Error("Failed to store package allowed items");
  }

  console.log("resData from createPackage=>", resData);

  return resData;
}

export async function storePackageAllowedItems(data: {
  package_item_id: number;
  allowed_count: number;
}) {
  const baseUrl = process.env.API_APP_URL;
  const session = await Auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const res = await fetch(`${baseUrl}/api/package-allowed-items/store`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify(data),
  });

  const resData = await res.json();

  if (!res.ok) {
    throw new Error(resData.message || "Failed to store package allowed items");
  }

  return resData;
}

export async function deletePackageItem(id: number) {
  const baseUrl = process.env.API_APP_URL;
  const session = await Auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const res = await fetch(`${baseUrl}/api/package-items/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });

  const resData = await res.json();

  if (!res.ok) {
    throw new Error(resData.message || "Failed to delete package item");
  }

  console.log("resData from deletePackageItem=>", resData);

  return resData;
}
