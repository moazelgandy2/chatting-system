import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: {
      ...(await import(`../messages/${locale}/dashboard.json`)),
      ...(await import(`../messages/${locale}/chat.json`)),
      ...(await import(`../messages/${locale}/intro.json`)),
      ...(await import(`../messages/${locale}/auth.json`)),
    },
  };
});
