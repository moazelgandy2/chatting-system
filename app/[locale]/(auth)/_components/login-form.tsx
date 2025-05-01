"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { LoginFormSchema, createLoginFormSchema } from "@/forms/login.schema";
import { z } from "zod";

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
import AttractiveButton from "@/components/kokonutui/btn-03";
import { Fingerprint } from "lucide-react";
import { useState } from "react";

export function LoginForm() {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create schema with localized error messages
  const loginSchema = createLoginFormSchema(t);

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    try {
      setIsSubmitting(true);
      console.log(values);
      // Add your login logic here
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.form.email.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("auth.form.email.placeholder")}
                  {...field}
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.form.password.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("auth.form.password.placeholder")}
                  {...field}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex justify-center">
          <AttractiveButton
            icon={<Fingerprint className="w-4 h-4" />}
            defaultText={t("auth.login.text")}
            attractingText={t("auth.login.attractingText")}
            type="submit"
          />
        </div>
      </form>
    </Form>
  );
}
