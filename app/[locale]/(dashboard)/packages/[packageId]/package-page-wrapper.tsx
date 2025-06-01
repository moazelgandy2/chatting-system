"use client";

import { usePackage } from "@/hooks/use-package";
import { motion } from "framer-motion";
import ItemCard from "./_components/item-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreatePackageItemDialog } from "./_components/create-package-item";
import { PackageSkeleton } from "./_components/package-skeleton";
import { PackageError } from "./_components/package-error";
import { PackageNotFound } from "./_components/package-not-found";
import { EmptyPackageContent } from "./_components/empty-package-content";
import { Button } from "@/components/ui/button";
import { useDeletePackage } from "@/hooks/use-packages";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export const PackagePageWrapper = ({ packageId }: { packageId: number }) => {
  const { data, isLoading, isError } = usePackage(packageId);
  const { mutate } = useDeletePackage();
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const onDeletePackage = async (id: string) => {
    try {
      await mutate(id);
      setTimeout(() => {
        router.push("/packages");
      }, 500);
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  if (isLoading) {
    return <PackageSkeleton />;
  }

  if (isError) {
    return <PackageError />;
  }
  if (!data) {
    return <PackageNotFound />;
  }

  return (
    <div className="container mx-auto px-4 max-w-6xl relative">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2"
        >
          <h2 className="text-xl font-semibold">{data.data.name}</h2>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">{t("package.details.clickTooltip")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      </div>

      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        {data.data.description}
      </p>
      <div className="flex justify-between w-full px-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t("package.details.packageContent")}
        </h2>

        <AlertDialog>
          <AlertDialogTrigger>
            <Button
              size={"icon"}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              <Trash2 className=" h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("package.available.confirmDelete")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("package.available.deleteWarning")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("package.available.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDeletePackage(packageId.toString())}
                className="bg-red-600 hover:bg-red-700"
              >
                {t("package.available.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <ScrollArea
        className="h-[64dvh]"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        {data.data.package_items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-3">
            {data.data.package_items.map((item, index) => (
              <ItemCard
                key={item.id}
                item={item}
                index={index}
              />
            ))}
          </div>
        ) : (
          <EmptyPackageContent />
        )}
      </ScrollArea>
      <div className="absolute bottom-8 cursor-pointer left-8 w-12 h-12 bg-muted rounded-full flex justify-center items-center">
        <CreatePackageItemDialog />
      </div>
    </div>
  );
};
