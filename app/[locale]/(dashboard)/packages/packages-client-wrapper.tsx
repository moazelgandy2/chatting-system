"use client";

import { usePackages } from "@/hooks/use-packages";
import { PackageCard } from "./_components/package-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";
import PackagesSkeleton from "./_components/packages-skeleton";
import PackagesError from "./_components/packages-error";
import { Package } from "lucide-react";
import { PageHeader } from "@/components/page-header";

import { CreatePackageDialog } from "./_components/create-package";

export default function PackagesClientWrapper() {
  const { data: packagesResponse, isLoading, isError } = usePackages();
  const packages = packagesResponse?.data || [];
  const t = useTranslations();

  if (isLoading) {
    return <PackagesSkeleton />;
  }

  if (isError) {
    return <PackagesError />;
  }

  return (
    <div className="container mx-auto p-2 relative">
      <PageHeader
        icon={<Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
        title={t("dashboard.navigation.packages")}
      />
      <ScrollArea className="h-[74vh] rounded-xl px-1">
        <div className="flex w-full flex-wrap">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="w-full md:w-1/2 lg:w-1/3 p-2"
            >
              <PackageCard
                name={pkg.name}
                id={pkg.id}
                src="https://pbs.twimg.com/media/GgMiuRpa4AAoW2y?format=jpg&name=medium"
                description={pkg.description}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="absolute bottom-8 cursor-pointer left-8 w-12 h-12 bg-muted rounded-full flex justify-center items-center">
        <CreatePackageDialog />
      </div>
    </div>
  );
}
