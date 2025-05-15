import { SessionType } from "@/types";
import { cookies } from "next/headers";

export const Auth = async () => {
  const cookie = (await cookies()).get("session")?.value;

  console.log("[SESSION_FROM_AUTH_HOOK]=>", cookie);

  const session: SessionType = cookie ? JSON.parse(cookie) : null;

  if (!session) {
    console.error("[SESSION_FROM_AUTH_HOOK] No session found");
    return null;
  } else {
    // console.log("[SESSION_FROM_AUTH_HOOK]=>", session);
    return session;
  }
};
