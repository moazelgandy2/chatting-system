"use server";

import { Auth } from "@/hooks/auth";
import { CreateUserType } from "@/types";

export const createUser = async (userData: CreateUserType) => {
  try {
    const baseUrl = process.env.API_APP_URL || "";
    const session = await Auth();

    if (!session) {
      throw new Error("UnAuthorized");
    }

    console.log("baseUrl=>", baseUrl);
    const response = await fetch(`${baseUrl}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify(userData),
    });

    console.log("Data", response);
    const data = await response.json();

    if (!response.ok) {
      console.log("response=>", data);
      const error = new Error(data.message || "Failed to create user");
      error.name = "CreateUserError";
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const fetchUser = async (page = 1, search = "") => {
  try {
    const session = await Auth();
    if (!session) {
      throw new Error("Unauthorized");
    }
    const apiBaseUrl = process.env.API_APP_URL;
    if (!apiBaseUrl) {
      throw new Error("API base URL not set");
    }
    const params = new URLSearchParams();
    params.append("page", String(page));
    if (search) params.append("search", search);
    const res = await fetch(`${apiBaseUrl}/api/users?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error("Failed to fetch users", { cause: data });
    }
    return data.data;
  } catch (e) {
    console.log("[ERROR_FETCHING_USERS]", e);
    throw new Error("Error fetching users");
  }
};
