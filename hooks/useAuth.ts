import { useState, useEffect } from "react";
import { SessionType } from "@/types";

interface AuthState {
  session: SessionType | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
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
