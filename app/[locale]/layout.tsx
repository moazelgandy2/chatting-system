import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import "../globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { QueryProvider } from "@/lib/providers/query-provider";

export const metadata: Metadata = {
  title: "Marktopia",
  description: "Marktopia chatting system home page",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Changed from Promise<{ locale: string | undefined }>
}) {
  const { locale } = await params; // Changed from await params

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      dir={`${locale === "ar" ? "rtl" : "ltr"}`}
      className="dark w-full"
    >
      <body className="w-full">
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <Toaster
              position={locale === "ar" ? "top-left" : "top-right"}
              expand
              visibleToasts={5}
            />
            {children}
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
