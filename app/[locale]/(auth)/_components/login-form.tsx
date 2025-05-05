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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data = await res.json();
      console.log(data);

      toast.success(data.message);

      router.push("/");

      console.log(values);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || t("auth.login.error"));
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
            disabled={isSubmitting}
            isLoading={isSubmitting}
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
