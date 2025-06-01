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
import { useUsers } from "@/hooks/use-users";
import { useChatsRevalidate } from "@/hooks/use-chats";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ChatFormProps {
  onSubmit: (data: ChatFormType) => void;
  isSubmitting?: boolean;
  error?: string | null;
}

export function ChatForm({
  onSubmit,
  isSubmitting = false,
  error,
}: ChatFormProps) {
  const t = useTranslations();
  const formSchema = createChatFormSchema(t);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const { data, isLoading } = useUsers(page, search);
  const revalidateChats = useChatsRevalidate();
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
      onSubmit(data);

      revalidateChats();
      router.refresh();
    } catch (e) {
      console.log("[ERROR_CREATING_CHAT_FORM]", e);
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
                    Chat Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter chat name"
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
                    Chat Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter chat description"
                      className="w-full bg-[#18181b] border border-gray-700 rounded text-xs text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="relative w-64">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="w-4 h-4" />
              </span>
              <Input
                placeholder="Search users by name or email"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-8 w-64"
              />
            </div>
          </div>
          <div className="overflow-x-auto border border-gray-700 rounded-md bg-[#18181b]">
            <table className="min-w-full text-[11px]">
              <thead className="bg-[#23232a]">
                <tr>
                  <th className="px-2 py-1 text-left font-semibold text-gray-200 uppercase">
                    Name
                  </th>
                  <th className="px-2 py-1 text-left font-semibold text-gray-200 uppercase">
                    Email
                  </th>
                  <th className="px-2 py-1 text-left font-semibold text-gray-200 uppercase">
                    Role
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
                          {selectedUser === user.id ? "Selected" : "Select"}
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
                      No users found
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
              Previous
            </Button>
            <span className="text-xs text-gray-500">
              Page {data?.current_page || 1} of {data?.last_page || 1}
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
              Next
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
              Creating Chat...
            </>
          ) : (
            "Create Chat"
          )}
        </Button>
      </form>
    </Form>
  );
}
