"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Languages, LoaderCircleIcon } from "lucide-react";
import React, { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Locale, usePathname, useRouter } from "../i18n/routing";
import { useLocale } from "next-intl";

const locales = [
  { value: "en", label: "English" },
  { value: "ar", label: "العربيه" },
] as const;

type LocaleValue = (typeof locales)[number]["value"];

export function LocaleSwitcherDropdown() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();

  function onChange(value: LocaleValue) {
    const nextLocale = value as Locale;

    startTransition(() => {
      router.replace(
        `${pathname}?${new URLSearchParams(searchParams)}` as never,
        {
          locale: nextLocale,
        }
      );
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="w-full justify-between"
          variant={"outline"}
          disabled={isPending}
        >
          <Languages className="size-4" />

          {isPending ? (
            <span className="uppercase animate-pulse">
              <LoaderCircleIcon className="size-4 animate-spin" />
            </span>
          ) : (
            <span className="uppercase text-base">
              {locales.find((l) => l.value === locale)?.label ?? "English"}
            </span>
          )}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          className="w-full"
          defaultValue={locale}
          value={locale}
          onValueChange={onChange as (value: string) => void}
        >
          {locales.map((val) => (
            <DropdownMenuRadioItem
              key={val.value}
              value={val.value}
              className="w-full text-white"
            >
              {val.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
