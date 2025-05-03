"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export type BreadcrumbItem = {
  path: string;
  label: string;
  isLast: boolean;
};

export function useBreadcrumb() {
  const pathname = usePathname();
  const i18n = useTranslations();

  const breadcrumbItems = useMemo(() => {
    const pathWithoutLocale = pathname
      ? pathname.replace(/^\/(?:ar|en)(?:\/|$)/, "/")
      : "/";

    const segments = pathWithoutLocale
      .split("/")
      .filter((segment): segment is string => Boolean(segment));

    if (segments.length === 0) {
      return [
        { path: "/", label: i18n("dashboard.navigation.home"), isLast: true },
      ];
    }

    return [
      { path: "/", label: i18n("dashboard.navigation.home"), isLast: false },
      ...segments.map((segment: string, index: number) => {
        const path = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;

        const isDynamicSegment =
          !isNaN(Number(segment)) ||
          segment.length > 20 ||
          segment.includes("-");

        let label;

        if (isDynamicSegment) {
          label = segment
            .replace(/-/g, " ")
            .replace(/^\w/, (c: string) => c.toUpperCase());
        } else {
          try {
            label = i18n(`dashboard.navigation.${segment}`);
          } catch (e) {
            label = segment
              .replace(/-/g, " ")
              .replace(/^\w/, (c: string) => c.toUpperCase());
          }
        }

        return { path, label, isLast };
      }),
    ];
  }, [pathname, i18n]);

  return { breadcrumbItems };
}
