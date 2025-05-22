"use server";

import { PackageFormType } from "@/forms/create-package.schema";
import { Auth } from "@/hooks/auth";
import { PackageData } from "@/types";

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

export const createPackage = async (packageData: PackageFormType) => {
  try {
    const session = await Auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const apiBaseUrl = process.env.API_APP_URL;

    if (!apiBaseUrl) {
      throw new Error("API base URL not set");
    }

    const res = await fetch(`${apiBaseUrl}/api/packages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(packageData),
    });

    console.log("[CREATE_PACKAGE]", res);

    const data = await res.json();

    console.log("[CREATE_PACKAGE]", data, res);

    if (!res.ok) {
      throw new Error("Failed to create package", { cause: data });
    }

    if (!res.ok) {
      throw new Error("Failed to create package");
    }

    return data;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to create package");
  }
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
