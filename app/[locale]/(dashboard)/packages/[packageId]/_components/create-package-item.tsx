"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PlusCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { CreatePackageItemForm } from "./create-package-item-form";
import { PackageItemFormType } from "@/forms/create-package-item.schema";
import { useState } from "react";
import { useCreatePackageItem } from "@/hooks/use-package-items";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { usePackageRevalidate } from "@/hooks/use-package";

export function CreatePackageItemDialog() {
  const t = useTranslations();
  const { session } = useAuth();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useCreatePackageItem();
  const params = useParams();
  const packageId = parseInt(params.packageId as string);
  const createdBy = session?.user.id || 0;
  const revalidate = usePackageRevalidate(packageId);

  const handleSubmit = async (data: PackageItemFormType) => {
    setError(null);
    try {
      await mutateAsync(data);
      setOpen(false);
    } catch (e: any) {
      setError(e?.message || "Something went wrong!");
    } finally {
      revalidate();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="cursor-pointer"
              >
                <PlusCircleIcon className="w-8 h-8 text-white" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("packages.add")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("create.packageItemDialogTitle")}</DialogTitle>
          <DialogDescription>
            {t("create.packageItemDialogDescription")}
          </DialogDescription>
        </DialogHeader>
        <CreatePackageItemForm
          handleSubmit={handleSubmit}
          isSubmitting={isPending}
          error={error}
          packageId={packageId}
          createdBy={createdBy}
        />
      </DialogContent>
    </Dialog>
  );
}
