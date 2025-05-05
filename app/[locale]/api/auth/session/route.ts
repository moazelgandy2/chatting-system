import { SessionType } from "@/types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const cookie = (await cookies()).get("session")?.value;

    const session: SessionType = cookie ? JSON.parse(cookie) : null;

    if (!session) {
      console.error("[SESSION_FROM_AUTH_HOOK] No session found", session);
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json(session, { status: 200 });
  } catch (e) {
    console.log("[AUTH_API_GET_SESSION_API]");
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
