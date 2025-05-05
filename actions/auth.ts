"use server";

import { redirect } from "next/navigation";
import { deleteSession } from "@/lib/session";

export async function logout() {
  // Delete the server-side session
  await deleteSession();
  redirect("/auth");
}

// Client-side logout function for use in a client component
export const clientLogout = async () => {
  try {
    // Clean up service worker registrations
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Unregister all service workers
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log("Service worker unregistered:", registration);
      }
    }

    // Clear FCM token from local storage if it exists
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("fcm_token");
    }

    // Call the server logout function
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // Redirect to auth page
      window.location.href = "/auth";
    }
  } catch (error) {
    console.error("Error during client logout:", error);
    // Fallback to server logout
    window.location.href = "/api/auth/logout";
  }
};
