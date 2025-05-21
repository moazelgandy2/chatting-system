"use server";

import { Auth } from "@/hooks/auth";

export const fetchPackages = async () => {
  const session = await Auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const apiBaseUrl = process.env.API_APP_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL not set");
  }

  const res = await fetch(`${apiBaseUrl}/api/packages`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to delete package", { cause: data });
  }

  return data;
};

export const fetchPackage = async (packageId: string) => {
  const session = await Auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const apiBaseUrl = process.env.API_APP_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL not set");
  }

  const res = await fetch(`${apiBaseUrl}/api/packages/${packageId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to fetch package", { cause: data });
  }

  return data;
};

export const deletePackage = async (packageId: string) => {
  const session = await Auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const apiBaseUrl = process.env.API_APP_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL not set");
  }

  const res = await fetch(`${apiBaseUrl}/api/packages/${packageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to delete package", { cause: data });
  }

  return data;
};

export const createPackage = async ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => {
  const session = await Auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const apiBaseUrl = process.env.API_APP_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL not set");
  }
  const response = await fetch(`${apiBaseUrl}/api/packages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, description }),
  });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || "Failed to create package");
    error.name = "CreatePackageError";
    throw error;
  }
  return data;
};

export const createPackageItem = async ({
  package_id,
  type_id,
  status,
  notes,
  created_by,
}: {
  package_id: number;
  type_id: number;
  status: string;
  notes: string;
  created_by: number;
}) => {
  const session = await Auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const apiBaseUrl = process.env.API_APP_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL not set");
  }
  const response = await fetch(`${apiBaseUrl}/api/package-items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ package_id, type_id, status, notes, created_by }),
  });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || "Failed to create package item");
    error.name = "CreatePackageItemError";
    throw error;
  }
  return data;
};

export const createItemType = async ({ name }: { name: string }) => {
  const session = await Auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const apiBaseUrl = process.env.API_APP_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL not set");
  }
  const formData = new FormData();
  formData.append("name", name);
  const response = await fetch(`${apiBaseUrl}/api/item-types/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || "Failed to create item type");
    error.name = "CreateItemTypeError";
    throw error;
  }
  return data;
};

export const fetchItemTypes = async () => {
  const session = await Auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const apiBaseUrl = process.env.API_APP_URL;
  if (!apiBaseUrl) {
    throw new Error("API base URL not set");
  }
  const res = await fetch(`${apiBaseUrl}/api/item-types`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error("Failed to fetch item types", { cause: data });
  }
  return data;
};
