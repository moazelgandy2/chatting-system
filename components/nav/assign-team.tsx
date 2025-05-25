"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users } from "lucide-react";
import { SidebarMenuSubButton, SidebarMenuSubItem } from "../ui/sidebar";
import { Button } from "@/components/ui/button";
import { useTeamMembers } from "@/hooks/use-users";
import { useAssignTeamToChat } from "@/hooks/use-chat";
import { Loader2, Search } from "lucide-react";
import { useChats } from "@/hooks/use-chats";
import { useRouter } from "next/navigation";

export function AssignTeamDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const { data: chatsData, isLoading: chatsLoading } = useChats();
  const chatOptions = chatsData?.data || [];
  const [chatId, setChatId] = useState<number | undefined>(chatOptions[0]?.id);
  const { data, isLoading } = useTeamMembers(page, search);
  const { mutateAsync, isPending } = useAssignTeamToChat();
  const router = useRouter();

  useEffect(() => {
    if (chatOptions.length && chatId === undefined) {
      setChatId(chatOptions[0].id);
    }
  }, [chatOptions, chatId]);

  const handleToggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };
  const handleSubmit = async () => {
    setError(null);
    if (!chatId) return;
    try {
      await mutateAsync({ chatId, team_ids: selected });
      setOpen(false);
      setSelected([]);
      router.refresh();
    } catch (e: any) {
      setError(e?.message || "Something went wrong!");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <SidebarMenuSubItem>
          <SidebarMenuSubButton className="cursor-pointer">
            <Users className="w-3 h-3" />
            <span>Assign Team</span>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
            Assign Team Members
          </DialogTitle>
          <DialogDescription>
            Select a chat and team members to assign.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <label
              htmlFor="chat-select"
              className="text-xs text-gray-400"
            >
              Chat:
            </label>
            <select
              id="chat-select"
              className="bg-background border border-gray-700 rounded px-2 py-1 text-xs text-gray-100"
              value={chatId}
              onChange={(e) => setChatId(Number(e.target.value))}
              disabled={chatsLoading || chatOptions.length === 0}
            >
              {chatsLoading && <option>Loading...</option>}
              {chatOptions.map((chat) => (
                <option
                  key={chat.id}
                  value={chat.id}
                >
                  {chat.name || `Chat #${chat.id}`}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="relative w-64">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="w-4 h-4" />
              </span>
              <input
                placeholder="Search team members"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-8 w-64 bg-[#18181b] border border-gray-700 rounded text-xs text-gray-100"
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
                  <th className="px-2 py-1"></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-2"
                    >
                      <Loader2 className="animate-spin mx-auto w-3 h-3 text-gray-400" />
                    </td>
                  </tr>
                ) : data && data.data.length > 0 ? (
                  data.data.map((user, idx) => (
                    <tr
                      key={user.id}
                      className={
                        (selected.includes(user.id)
                          ? "bg-blue-900/60 border-l-2 border-blue-500"
                          : idx % 2 === 0
                          ? "bg-[#18181b]"
                          : "bg-[#23232a]") +
                        " transition-colors hover:bg-blue-900/40"
                      }
                      style={{ height: 28 }}
                    >
                      <td className="px-2 py-1 whitespace-nowrap text-gray-100">
                        {user.name}
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap text-gray-300">
                        {user.email}
                      </td>
                      <td className="px-2 py-1">
                        <input
                          type="checkbox"
                          checked={selected.includes(user.id)}
                          onChange={() => handleToggle(user.id)}
                          className="accent-indigo-500 w-4 h-4"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-2 text-gray-500"
                    >
                      No team members found
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
          <Button
            type="button"
            className="w-full bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 transition-all duration-300"
            disabled={isPending || selected.length === 0}
            onClick={handleSubmit}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              "Assign Team"
            )}
          </Button>
          {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
