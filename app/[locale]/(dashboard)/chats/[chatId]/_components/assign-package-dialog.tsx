"use client";

import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Package, Loader2, PackagePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { usePackages } from "@/hooks/use-packages";
import { useAssignPackage } from "@/hooks/use-assign-package";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ClientLimitsDialog } from "./client-limits-dialog";

const assignPackageSchema = z.object({
  package_id: z.string().min(1, "Please select a package"),
  status: z.enum(["active", "inactive"]),
});

type AssignPackageFormData = z.infer<typeof assignPackageSchema>;

interface AssignPackageDialogProps {
  chatId: string;
  trigger?: React.ReactNode;
}

export function AssignPackageDialog({
  chatId,
  trigger,
}: AssignPackageDialogProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [assignedPackageId, setAssignedPackageId] = useState<number | null>(
    null
  );
  const [clientPackageId, setClientPackageId] = useState<number | null>(null);
  const [showLimitsDialog, setShowLimitsDialog] = useState(false);
  const { session } = useAuth();
  const { data: packagesResponse, isLoading: isLoadingPackages } =
    usePackages();
  const { mutateAsync: assignPackage, isPending } = useAssignPackage();

  const packages = packagesResponse?.data || [];
  const clientId = session?.user?.id;
  const form = useForm<AssignPackageFormData>({
    resolver: zodResolver(assignPackageSchema),
    defaultValues: {
      package_id: "",
      status: "active" as const,
    },
  });
  const handleSubmit = async (data: AssignPackageFormData) => {
    if (!clientId) {
      console.error("Client ID not found");
      return;
    }

    try {
      const response = await assignPackage({
        client_id: clientId,
        package_id: parseInt(data.package_id),
        chat_id: parseInt(chatId),
        status: data.status,
      });

      // Store the assigned package info for client limits dialog
      setAssignedPackageId(parseInt(data.package_id));
      setClientPackageId(response?.data?.id || null);
      setOpen(false);
      form.reset();

      // Show client limits dialog after successful assignment
      setShowLimitsDialog(true);
    } catch (error) {
      console.error("Error assigning package:", error);
    }
  };
  const defaultTrigger = (
    <Button
      variant="default"
      size="sm"
      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
    >
      <PackagePlus className="h-4 w-4 mr-2" />
      {t("assignPackage.buttonText", { default: "Assign Package" })}
    </Button>
  );

  // Get the assigned package data for client limits dialog
  const assignedPackage = assignedPackageId
    ? packages.find((pkg) => pkg.id === assignedPackageId)
    : null;
  return (
    <>
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {t("assignPackage.title", { default: "Assign Package" })}
            </DialogTitle>
            <DialogDescription>
              {t("assignPackage.description", {
                default:
                  "Select a package to assign to this client for this chat.",
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
                name="package_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("assignPackage.package", { default: "Package" })}
                    </FormLabel>
                    <Select
                      disabled={isLoadingPackages || isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingPackages
                                ? t("assignPackage.loading", {
                                    default: "Loading packages...",
                                  })
                                : t("assignPackage.selectPackage", {
                                    default: "Select a package",
                                  })
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {packages.map((pkg) => (
                          <SelectItem
                            key={pkg.id}
                            value={pkg.id.toString()}
                          >
                            {pkg.name}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("assignPackage.status", { default: "Status" })}
                    </FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">
                          {t("assignPackage.active", { default: "Active" })}
                        </SelectItem>
                        <SelectItem value="inactive">
                          {t("assignPackage.inactive", { default: "Inactive" })}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                >
                  {t("assignPackage.cancel", { default: "Cancel" })}
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || isLoadingPackages || !packages.length}
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("assignPackage.assign", { default: "Assign" })}
                </Button>{" "}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Client Limits Dialog - shown after successful package assignment */}
      {showLimitsDialog && assignedPackage && clientPackageId && (
        <ClientLimitsDialog
          chatId={chatId}
          clientPackageId={clientPackageId}
          packageItems={assignedPackage.package_items || []}
          trigger={null}
        />
      )}
    </>
  );
}
