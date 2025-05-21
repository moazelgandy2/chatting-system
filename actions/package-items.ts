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
    const error = await res.json();
    throw new Error(error.message || "Failed to create package item");
  }
  console.log("resData from createPackage=>", resData);

  return resData;
}
