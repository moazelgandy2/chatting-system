"server only";
import { SessionType } from "@/types";
import { cookies } from "next/headers";

export async function createSession(session: SessionType) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  (await cookies()).set("session", JSON.stringify(session), {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  });
  console.log("[CREATE_NEW_SESSION]", session);
}

export async function updateSession(session: SessionType) {
  await createSession(session);
  console.log("session updated=>", session);
}

export async function deleteSession() {
  (await cookies()).delete("session");
}
