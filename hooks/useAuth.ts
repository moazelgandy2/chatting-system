import { useState, useEffect } from "react";
import { SessionType } from "@/types";

interface AuthState {
  session: SessionType | null;
}

function getSessionFromCookie(): SessionType | null {
  if (typeof document === "undefined") return null;

  try {
    const sessionCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("session="));

    if (sessionCookie) {
      const sessionValue = sessionCookie.split("=")[1];
      const decodedValue = decodeURIComponent(sessionValue);
      return JSON.parse(decodedValue);
    }
  } catch (error) {
    console.error("Error reading session from cookie:", error);
  }

  return null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    session: getSessionFromCookie(),
  });

  const refreshUserData = async () => {
    try {
      const response = await fetch("/api/auth/session");
      if (!response.ok) {
        setAuthState({
          session: null,
        });
        return null;
      }

      const sessionData = await response.json();

      if (sessionData) {
        setAuthState({
          session: sessionData,
        });
        return sessionData;
      } else {
        setAuthState({
          session: null,
        });
        return null;
      }
    } catch (error) {
      console.error("Error parsing user cookie:", error);
      setAuthState({
        session: null,
      });
      return null;
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  return {
    session: authState.session,
    refreshUserData,
  };
}
