"use client";

import { ChevronRight, Loader2, Package } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePackages } from "@/hooks/use-packages";
import { PackageData } from "@/types/packages";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { LinkStatus } from "@/components/nav-main";

export function PackagesNavItemSkeleton() {
  const t = useTranslations();

  return (
    <SidebarMenuItem className="relative">
      <SidebarMenuButton tooltip={t("packages.available")}>
        <div className="flex items-center gap-2 cursor-default">
          <Package />
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

  if (packagesError && !hasPackages) {
    return null;
  }

  return (
    <Collapsible
      asChild
      defaultOpen={false}
    >
      <SidebarMenuItem className="relative">
        <SidebarMenuButton
          asChild
          tooltip={t("packages.available")}
        >
          <CollapsibleTrigger className="flex items-center gap-2 cursor-pointer">
            <Package />
            <span>{t("packages.available")}</span>
          </CollapsibleTrigger>
        </SidebarMenuButton>
        <CollapsibleTrigger asChild>
          <SidebarMenuAction className="data-[state=open]:rotate-90">
            <ChevronRight />
            <span className="sr-only">Toggle</span>
          </SidebarMenuAction>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {hasPackages ? (
              packages.map((pkg: PackageData) => (
                <SidebarMenuSubItem key={pkg.id}>
                  <SidebarMenuSubButton asChild>
                    <Link href={`/packages/${pkg.id}`}>
                      <Package className="w-3 h-3" />
                      <span>{pkg.name}</span>
                      <LinkStatus />
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))
            ) : (
              <div className="py-2 text-center text-xs text-muted-foreground">
                No packages available
              </div>
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
