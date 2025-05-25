"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Settings } from "lucide-react";
import {
  clientLimitsSchema,
  ClientLimitsFormType,
} from "@/forms/client-limits.schema";
import { useStoreClientLimits } from "@/hooks/use-client-limits";
import { getClientId } from "@/actions/assign-package";

interface ClientLimitsDialogProps {
  chatId: string;
  clientPackageId: number;
  packageItems: Array<{
    id: number;
    item_type: {
      id: number;
      name: string;
    };
  }>;
  trigger?: React.ReactNode | null;
}

export function ClientLimitsDialog({
  chatId,
  clientPackageId,
  packageItems,
  trigger,
}: ClientLimitsDialogProps) {
  const [open, setOpen] = useState(trigger === null ? true : false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: storeClientLimits, isPending } = useStoreClientLimits();
  const t = useTranslations();

  const form = useForm<ClientLimitsFormType>({
    resolver: zodResolver(clientLimitsSchema),
    defaultValues: {
      item_type: "",
      edit_limit: 0,
      decline_limit: 0,
    } as const,
  });

  const handleSubmit = async (data: ClientLimitsFormType) => {
    setError(null);
    try {
      // Get client ID from the chat
      const clientId = await getClientId(chatId);

      await storeClientLimits({
        client_id: clientId,
        client_package_id: clientPackageId,
        item_type: data.item_type,
        edit_limit: data.edit_limit,
        decline_limit: data.decline_limit,
      });

      setOpen(false);
      form.reset();
    } catch (e: any) {
      setError(e?.message || "Failed to store client limits");
    }
  };

  // Get unique item types from package items
  const itemTypes = packageItems
    .map((item) => item.item_type)
    .filter(
      (type, index, self) => index === self.findIndex((t) => t.id === type.id)
    );
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      {trigger !== null && (
        <DialogTrigger asChild>
          {trigger || (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              {t("clientLimits.setLimits", { default: "Set Limits" })}
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {t("clientLimits.dialogTitle", { default: "Set Client Limits" })}
          </DialogTitle>
          <DialogDescription>
            {t("clientLimits.dialogDescription", {
              default: "Configure edit and decline limits for package items.",
            })}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="item_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("clientLimits.itemType", { default: "Item Type" })}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("clientLimits.selectItemType", {
                            default: "Select item type",
                          })}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {itemTypes.map((type) => (
                        <SelectItem
                          key={type.id}
                          value={type.name}
                        >
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="edit_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("clientLimits.editLimit", { default: "Edit Limit" })}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="decline_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("clientLimits.declineLimit", {
                      default: "Decline Limit",
                    })}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}{" "}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                {trigger === null
                  ? t("common.skip", { default: "Skip" })
                  : t("common.cancel", { default: "Cancel" })}
              </Button>
              <Button
                type="submit"
                disabled={isPending}
              >
                {isPending
                  ? t("common.saving", { default: "Saving..." })
                  : t("clientLimits.saveLimits", { default: "Save Limits" })}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
