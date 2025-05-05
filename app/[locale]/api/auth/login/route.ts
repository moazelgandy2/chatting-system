import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getLocalizedData, getLocaleFromRequest } from "@/lib/i18n-api";
import { SessionType } from "@/types";
import { createSession } from "@/lib/session";

type SupportedLocale = (typeof routing.locales)[number];
type RouteParams = { params: Promise<{ locale: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const localeParam = (await params).locale as SupportedLocale;
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
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("[AUTH_LOGIN_API_ERROR]", "Login failed", res.statusText);
      return NextResponse.json({ error: t("login.error") }, { status: 401 });
    }
    console.log("[AUTH_LOGIN_API_SUCCESS]", data);

    const session: SessionType = {
      user: data.user,
      token: data.token,
    };

    await createSession(session);

    return NextResponse.json({ message: t("login.success") });
  } catch (error) {
    console.error("[AUTH_LOGIN_API_ERROR]", error);

    try {
      const localeParam = (await params).locale as SupportedLocale;
      const t = await getTranslations({
        locale: localeParam,
        namespace: "auth",
      });
      return NextResponse.json({ error: t("login.error") }, { status: 500 });
    } catch (translationError) {
      console.error("[TRANSLATION_ERROR]", translationError);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 500 }
      );
    }
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    console.log("API Route Locale from params:", (await params).locale);

    const localeParam = (await params).locale as SupportedLocale;

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
