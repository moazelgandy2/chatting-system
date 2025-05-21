"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  packageFormSchema,
  PackageFormType,
} from "@/forms/create-package.schema";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { toast } from "sonner";
import { useCreatePackage } from "@/hooks/use-create-package";
import { PackageData } from "@/types/packages";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

interface PackageFormProps {
  onSubmit: (packageData: PackageData) => void;
  onCancel: () => void;
}

export function PackageForm({ onSubmit, onCancel }: PackageFormProps) {
  const t = useTranslations();
  const formSchema = packageFormSchema;

  const { mutateAsync, isPending } = useCreatePackage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleFormSubmit = async (data: PackageFormType) => {
    try {
      const createdPackage = await mutateAsync({
        name: data.name,
        description: data.description,
      });
      toast.success(t("package.created"));
      onSubmit(createdPackage.data);
    } catch (e: any) {
      console.error("[ERROR_CREATING_PACKAGE_FORM]", e);
      toast.error(e?.message || "Something went wrong!");
    }
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
          {t("create.packageTitle")}
        </DialogTitle>
        <DialogDescription>{t("create.packageDescription")}</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6 py-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-gray-300">
                  {t("create.name")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("create.name")}
                    className="w-full bg-[#18181b] border border-gray-700 rounded text-xs text-gray-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-gray-300">
                  {t("create.description")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("create.description")}
                    className="w-full bg-[#18181b] border border-gray-700 rounded text-xs text-gray-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("common.creating")}
              </>
            ) : (
              t("create.createPackageButton")
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full"
          >
            {t("package.available.cancel")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
