import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SessionType } from "@/types";
import { createSession } from "@/lib/session";

type SupportedLocale = (typeof routing.locales)[number];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const localeParam = (await params).locale as SupportedLocale;
  try {
    const t = await getTranslations({
      locale: localeParam,
      namespace: "auth",
    });

    const ApiBaseUrl = process.env.API_APP_URL;

    if (!ApiBaseUrl) {
      console.error(
        "[API_BASE_URL_ERROR]",
        "API base URL is not defined in environment variables."
      );

      return NextResponse.json({ error: t("login.error") }, { status: 500 });
    }

    if (!routing.locales.includes(localeParam)) {
      return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      console.log("[AUTH_LOGIN_API_ERROR]", "Email and password are required");
      return NextResponse.json({ error: t("login.error") }, { status: 400 });
    }

    console.log("[AUTH_LOGIN_API]", {
      email,
      password,
      locale: localeParam,
    });

    const res = await fetch(`${ApiBaseUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": localeParam,
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    console.log("[AUTH_LOGIN_API_RESPONSE]", res);
    const data = await res.json();
    if (!res.ok) {
      console.error("data=>", data);

      console.error(
        "[AUTH_LOGIN_API_ERROR_RES_NOT_OK]",
        "Login failed",
        res.statusText
      );
      return NextResponse.json({ error: data.message }, { status: 401 });
    }
    console.log("[AUTH_LOGIN_API_SUCCESS]", data);

    const session: SessionType = {
      user: data.data.user,
      token: data.data.token,
    };

    await createSession(session);

    return NextResponse.json({ message: t("login.success") });
  } catch (error) {
    console.error("[AUTH_LOGIN_API_ERROR_]", error);

    try {
      const t = await getTranslations({
        locale: localeParam,
        namespace: "auth",
      });
      const errorMessage =
        error instanceof Error ? error.message : t("login.error");
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    } catch (translationError) {
      console.error("[TRANSLATION_ERROR]", translationError);
      return NextResponse.json(
        { error: "Authentication failed and failed to load translations" },
        { status: 500 }
      );
    }
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const localeParam = (await params).locale as SupportedLocale;
  try {
    console.log("API Route Locale from params:", localeParam);

    if (!routing.locales.includes(localeParam)) {
      return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
    }

    const t = await getTranslations({ locale: localeParam, namespace: "auth" });

    return NextResponse.json({
      success: true,
      translations: {
        loginSuccess: t("login.success"),
        loginError: t("login.error"),
      },
      locale: localeParam,
    });
  } catch (error) {
    console.error("[API_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to access translations", details: String(error) },
      { status: 500 }
    );
  }
}
