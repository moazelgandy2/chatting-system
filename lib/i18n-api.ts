import { createTranslator } from "next-intl";
import { routing } from "@/i18n/routing"; // Adjust the import path as needed

export async function getLocalizedData(
  locale: (typeof routing.locales)[number]
) {
  if (!routing.locales.includes(locale)) {
    throw new Error(`Locale "${locale}" not found`);
  }
  const messages = {
    ...(await import(`../messages/${locale}/dashboard.json`)).default,
    ...(await import(`../messages/${locale}/chat.json`)).default,
    ...(await import(`../messages/${locale}/auth.json`)).default,
    ...(await import(`../messages/${locale}/package.json`)).default,
  };

  const translator = createTranslator({
    locale,
    messages,
  });

  return {
    formatMessage: (translator as any).translate,
    formatDateTime: (date: Date, options?: Intl.DateTimeFormatOptions) => {
      return new Intl.DateTimeFormat(locale, options).format(date);
    },
    formatNumber: (num: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(locale, options).format(num);
    },
    locale,
  };
}

export type LocalizedData = Awaited<ReturnType<typeof getLocalizedData>>;

export async function getLocaleFromRequest(
  request: Request
): Promise<(typeof routing.locales)[number] | undefined> {
  const url = new URL(request.url);
  const pathnameParts = url.pathname.split("/").filter(Boolean);

  // Assert the type to match the expected locales
  const firstPathPart = pathnameParts[0] as (typeof routing.locales)[number];

  if (routing.locales.includes(firstPathPart)) {
    return firstPathPart;
  }

  // If no locale is in the path, fallback to the default locale
  return routing.defaultLocale;
}
