"use client";

import { Button } from "@/components/ui/button";
import { PackagePlus } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PackagesPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("packages.available")}</h1>
      </div>
    </div>
  );
}
