"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
export const SideBar = () => {
  const i18n = useTranslations();
  return (
    <aside>
      <div className="flex justify-between items-start gap-4 bg-muted w-48 min-h-screen rounded-ee-2xl shadow-2xl">
        <div className="flex items-start justify-between gap-4 w-full border-8 p-2">
          <p className="text-sm">{i18n("dashboard.subtitle")}</p>
          <Image
            src={"/logo.png"}
            alt="Name"
            width={32}
            height={32}
          />
        </div>
      </div>
    </aside>
  );
};
