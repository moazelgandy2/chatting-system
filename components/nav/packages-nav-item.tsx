"use client";

import {
  ChevronRight,
  Loader2,
  MoreHorizontal,
  Package,
  PackageX,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePackages, useDeletePackage } from "@/hooks/use-packages";
import { PackageData } from "@/types/packages";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { LinkStatus } from "@/components/nav/nav-main";

export function PackagesNavItemSkeleton() {
  const t = useTranslations();

  return (
    <SidebarMenuItem className="relative">
      <SidebarMenuButton tooltip={t("packages.available")}>
        <div className="flex items-center gap-2 cursor-default">
          <Package className="w-4 h-4" />
          <span>{t("packages.available")}</span>
        </div>
      </SidebarMenuButton>
      <div className="py-2 pl-8">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-2 py-1.5"
            >
              <div className="h-3 w-3 rounded-full bg-muted-foreground/20 animate-pulse" />
              <div className="h-3.5 w-24 rounded-md bg-muted-foreground/20 animate-pulse" />
            </div>
          ))}
      </div>
    </SidebarMenuItem>
  );
}

export function PackagesNavItem() {
  const t = useTranslations();
  const { mutate } = useDeletePackage();
  const {
    data: packageResponse,
    isLoading: packagesLoading,
    isError: packagesError,
  } = usePackages();
  const packages = packageResponse?.data || [];

  const hasPackages = !packagesError && packages && packages.length > 0;

  if (packagesLoading) {
    return <PackagesNavItemSkeleton />;
  }

  if (packagesError || !hasPackages) {
    return (
      <SidebarMenuItem className="relative">
        <SidebarMenuButton tooltip={t("package.available.noPackages")}>
          <div className="flex items-center gap-2 cursor-default">
            <PackageX className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {t("package.available.noPackages")}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible defaultOpen={false}>
      <SidebarMenuItem className="relative">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={t("packages.available")}
            className="flex items-center w-full gap-2 text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>{t("packages.available")}</span>
            </div>
            <SidebarMenuAction className="ml-auto transition-transform duration-200 data-[state=open]:rotate-90">
              <ChevronRight className="w-4 h-4" />
              <span className="sr-only">Toggle</span>
            </SidebarMenuAction>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {hasPackages ? (
              packages.map((pkg: PackageData) => (
                <SidebarMenuItem
                  key={pkg.id}
                  className="relative group"
                >
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href={`/packages/${pkg.id}`}>
                        <Package className="w-3 h-3" />
                        <span className="truncate">{pkg.name}</span>
                        <LinkStatus />
                      </Link>
                    </SidebarMenuSubButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction className="opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="w-4 h-4" />
                          <span className="sr-only">More</span>
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-600 hover:!text-red-600 hover:!bg-red-100 dark:hover:!bg-red-700/50"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>{t("package.available.delete")}</span>
                            </DropdownMenuItem>
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
                                onClick={() => mutate(pkg.id.toString())}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {t("package.available.confirm")}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuSubItem>
                </SidebarMenuItem>
              ))
            ) : (
              <div className="py-2 text-center text-xs text-muted-foreground">
                {t("package.available.noPackages")}
              </div>
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
