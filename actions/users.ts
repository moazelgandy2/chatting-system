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
