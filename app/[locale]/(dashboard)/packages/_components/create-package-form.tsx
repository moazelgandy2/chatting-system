"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import {
  createPackageFormSchema,
  packageFormSchema,
  PackageFormType,
} from "@/forms/create-package.schema";
import { toast } from "sonner";
import Notification from "@/components/kokonutui/notification";
import { Loader2Icon } from "lucide-react";

export const CreatePackageForm = ({
  handleSubmit,
  isSubmitting,
  error,
}: {
  handleSubmit: (values: z.infer<typeof packageFormSchema>) => void;
  isSubmitting: boolean;
  error: string | null;
}) => {
  const t = useTranslations();
  const formSchema = createPackageFormSchema(t);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleFormSubmit = async (data: PackageFormType) => {
    try {
      handleSubmit(data);
    } catch (e) {
      console.log("[ERROR_CREATING_PACKAGE_FORM]", e);
      toast.custom(() => (
        <Notification
          message={error || "Something went wrong!"}
          type="error"
        />
      ));
    }
  };

  if (error) {
    toast.custom(() => (
      <Notification
        message={error}
        type="error"
      />
    ));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.name.title")}</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>{t("form.description.title")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2Icon className="w-4 h-4 animate-spin" />
          ) : (
            t("create.createPackageButton")
          )}
        </Button>
      </form>
    </Form>
  );
};
