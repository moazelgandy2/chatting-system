"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Search } from "lucide-react";
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
import { ChatFormType, createChatFormSchema } from "@/forms/create-chat.schema";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { toast } from "sonner";
import Notification from "./kokonutui/notification";
import { useClients } from "@/hooks/use-users";
import { CHATS_QUERY_KEY, useChatsRevalidate } from "@/hooks/use-chats";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ChatFormProps {
  onSubmit: (data: ChatFormType) => Promise<any>;
  isSubmitting?: boolean;
  error?: string | null;
}

export function ChatForm({
  onSubmit,
  isSubmitting = false,
  error,
}: ChatFormProps) {
  const t = useTranslations("chat"); // Changed from useTranslations()
  const formSchema = createChatFormSchema(t);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const { data, isLoading } = useClients(page, search);
  const { revalidate: revalidateChats, queryClient } = useChatsRevalidate();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: 0,
      name: "",
    },
  });

  const handleFormSubmit = async (data: ChatFormType) => {
    try {
      await onSubmit(data);

      await queryClient.invalidateQueries({ queryKey: [CHATS_QUERY_KEY] });
      router.refresh();
    } catch (e) {
      console.log("[ERROR_CREATING_CHAT_FORM]", e);
      toast.custom(() => (
        <Notification
          message={error || t("chatForm.genericError")}
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

  const handleUserSelect = (userId: number) => {
    setSelectedUser(userId);
    form.setValue("client_id", userId);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-300">
                    {t("chatForm.chatNameLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("chatForm.chatNamePlaceholder")}
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
                    {t("chatForm.chatDescriptionLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("chatForm.chatDescriptionPlaceholder")}
                      className="w-full bg-[#18181b] border border-gray-700 rounded text-xs text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="overflow-x-auto border border-gray-700 rounded-md bg-[#18181b]">
            <table className="min-w-full text-[11px]">
              <thead className="bg-[#23232a]">
                <tr>
                  <th className="px-2 py-1 text-left font-semibold text-gray-200 uppercase">
                    {t("chatForm.table.name")}
                  </th>
                  <th className="px-2 py-1 text-left font-semibold text-gray-200 uppercase">
                    {t("chatForm.table.email")}
                  </th>
                  <th className="px-2 py-1 text-left font-semibold text-gray-200 uppercase">
                    {t("chatForm.table.role")}
                  </th>
                  <th className="px-2 py-1"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-2"
                    >
                      <Loader2 className="animate-spin mx-auto w-3 h-3 text-gray-400" />
                    </td>
                  </tr>
                ) : data && data.data.length > 0 ? (
                  data.data.map((user, idx) => (
                    <tr
                      key={user.id}
                      className={cn("transition-colors hover:bg-blue-900/40", {
                        "bg-blue-900/60 border-l-2 border-blue-500":
                          selectedUser === user.id,
                        "bg-[#18181b]":
                          selectedUser !== user.id && idx % 2 === 0,
                        "bg-[#23232a]":
                          selectedUser !== user.id && idx % 2 !== 0,
                      })}
                      style={{ height: 28 }}
                    >
                      <td className="px-2 py-1 whitespace-nowrap text-gray-100">
                        {user.name}
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap text-gray-300">
                        {user.email}
                      </td>
                      <td className="px-2 py-1 capitalize whitespace-nowrap text-gray-300">
                        {user.role}
                      </td>
                      <td className="px-2 py-1">
                        <Button
                          type="button"
                          size="sm"
                          variant={
                            selectedUser === user.id ? "default" : "outline"
                          }
                          onClick={() => handleUserSelect(user.id)}
                          className="h-5 px-1 text-[10px]"
                        >
                          {selectedUser === user.id
                            ? t("chatForm.table.selectedButton")
                            : t("chatForm.table.selectButton")}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-2 text-gray-500"
                    >
                      {t("chatForm.table.noUsers")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!data?.prev_page_url || page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              {t("chatForm.pagination.previous")}
            </Button>
            <span className="text-xs text-gray-500">
              {t("chatForm.pagination.pageInfo", {
                currentPage: data?.current_page || 1,
                lastPage: data?.last_page || 1,
              })}
            </span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!data?.next_page_url || page === (data?.last_page || 1)}
              onClick={() =>
                setPage((p) =>
                  data?.last_page ? Math.min(data.last_page, p + 1) : p + 1
                )
              }
            >
              {t("chatForm.pagination.next")}
            </Button>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 transition-all duration-300"
          disabled={isSubmitting || !selectedUser}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("chatForm.creatingButton")}
            </>
          ) : (
            t("chatForm.createButton")
          )}
        </Button>
      </form>
    </Form>
  );
}
