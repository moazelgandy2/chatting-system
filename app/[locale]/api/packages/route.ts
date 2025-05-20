import { Auth } from "@/hooks/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await Auth();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const apiBaseUrl = process.env.API_APP_URL;

  if (!apiBaseUrl) {
    return NextResponse.json(
      { message: "API base URL not set" },
      { status: 500 }
    );
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
    return NextResponse.json(
      { message: "Failed to fetch packages" },
      { status: res.status }
    );
  }

  // console.log("Fetched packages:", data);

  return NextResponse.json(data, { status: 200 });
}
