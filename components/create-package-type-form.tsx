"use client";

import {
  createPackageTypeFormSchema,
  PackageTypeFormType,
} from "@/forms/create-package-type";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
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
import { LoaderCircleIcon } from "lucide-react";

export const CreatePackageTypeForm = ({
  onSubmit: handleSubmit,
  isLoading,
}: {
  onSubmit: (values: PackageTypeFormType) => void;
  isLoading: boolean;
}) => {
  const t = useTranslations();
  const formSchema = createPackageTypeFormSchema(t);
  const form = useForm<PackageTypeFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: PackageTypeFormType) {
    handleSubmit(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>Desc</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            "Save"
          )}
        </Button>
      </form>
    </Form>
  );
};
