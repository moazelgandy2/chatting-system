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
import PackageImageUploader from "./file-upload";
import { CreatePackageForm } from "./create-package-form";
import { PackageFormType } from "@/forms/create-package.schema";
import { useState } from "react";
import { useCreatePackage } from "@/hooks/use-packages";

export function CreatePackageDialog() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useCreatePackage();

  const handleSubmit = async (data: PackageFormType) => {
    setError(null);
    try {
      await mutateAsync(data);
      setOpen(false);
    } catch (e: any) {
      setError(e?.message || "Something went wrong!");
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
          <DialogTitle>{t("create.packageTitle")}</DialogTitle>
          <DialogDescription>
            {t("create.packageDescription")}
          </DialogDescription>
        </DialogHeader>
        <CreatePackageForm
          handleSubmit={handleSubmit}
          isSubmitting={isPending}
          error={error}
        />
      </DialogContent>
    </Dialog>
  );
}
