"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { User, Mail, Lock, Loader2 } from "lucide-react";
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

import { createUserFormSchema, UserFormType } from "@/forms/create-user.schema";
import { useTranslations } from "next-intl";
import { z } from "zod";
import AvatarPicker from "./role-picker";
import { toast } from "sonner";
import Notification from "./kokonutui/notification";

interface UserFormProps {
  onSubmit: (data: UserFormType) => void;
  initialData?: Partial<UserFormType>;
  isSubmitting?: boolean;
  error?: string | null;
}

export function UserForm({
  onSubmit,
  initialData,
  isSubmitting = false,
  error,
}: UserFormProps) {
  const [role, setRole] = useState("");

  const t = useTranslations();
  const formSchema = createUserFormSchema(t);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: initialData?.password || "",
      role,
    },
  });

  const onRoleChange = (value: string) => {
    setRole(value);
    form.setValue("role", value);
  };

  const handleFormSubmit = (data: UserFormType) => {
    try {
      onSubmit(data);
    } catch (e) {
      console.log("[ERROR_CREATING_USER_FORM]", e);
      toast.custom((t) => (
        <Notification
          message={error || "Something went wrong!"}
          type="error"
        />
      ));
    }
  };

  if (error) {
    toast.custom((t) => (
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
        className="space-y-6"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormLabel className="text-foreground/70 absolute -top-2 left-2 bg-background px-1 text-xs font-medium">
                    Name
                  </FormLabel>
                  <div className="flex items-center rounded-md border border-input focus-within:ring-1 focus-within:ring-ring">
                    <User className="ml-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        {...field}
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter your full name"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs" />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormLabel className="text-foreground/70 absolute -top-2 left-2 bg-background px-1 text-xs font-medium">
                    Email
                  </FormLabel>
                  <div className="flex items-center rounded-md border border-input focus-within:ring-1 focus-within:ring-ring">
                    <Mail className="ml-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter your email address"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs" />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormLabel className="text-foreground/70 absolute -top-2 left-2 bg-background px-1 text-xs font-medium">
                    Password
                  </FormLabel>
                  <div className="flex items-center rounded-md border border-input focus-within:ring-1 focus-within:ring-ring">
                    <Lock className="ml-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Create a secure password"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs" />
                </div>
              </FormItem>
            )}
          />
          <AvatarPicker onRoleChange={onRoleChange} />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 transition-all duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating User...
            </>
          ) : (
            "Create User"
          )}
        </Button>
      </form>
    </Form>
  );
}
