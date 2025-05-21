"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
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
import { useTranslations } from "next-intl";
import { z } from "zod";
import { toast } from "sonner";
import { useItemTypes } from "@/hooks/use-item-types";
import { useCreateItemType } from "@/hooks/use-create-item-type";
import { ItemType } from "@/types/item-types";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

const itemTypeFormSchema = z.object({
  name: z.string().min(3).max(50),
});

type ItemTypeFormType = z.infer<typeof itemTypeFormSchema>;

interface ItemTypeFormProps {
  onItemTypeSelectedOrCreated: (itemTypeId: number) => void;
  onBack: () => void;
}

export function ItemTypeForm({
  onItemTypeSelectedOrCreated,
  onBack,
}: ItemTypeFormProps) {
  const t = useTranslations();
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState<number | null>(null);

  const { data: itemTypesData, isLoading: isLoadingItemTypes } = useItemTypes();
  const { mutateAsync: createItemTypeMutate, isPending: isCreatingItemType } =
    useCreateItemType();
  const itemTypes = itemTypesData?.data || [];

  const form = useForm<ItemTypeFormType>({
    resolver: zodResolver(itemTypeFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleCreateItemTypeSubmit = async (data: ItemTypeFormType) => {
    try {
      const newItemType = await createItemTypeMutate(data);
      toast.success(t("itemType.createdSuccessfully")); // Assuming you'll add this key
      onItemTypeSelectedOrCreated(newItemType.data.id);
    } catch (error: any) {
      console.error("[ERROR_CREATING_ITEM_TYPE_FORM]", error);
      toast.error(error?.message || t("common.error")); // Assuming common.error key
    }
  };

  const handleSelectItemType = (itemTypeId: number) => {
    setSelectedItemType(itemTypeId);
    onItemTypeSelectedOrCreated(itemTypeId);
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>{t("create.itemTypeTitle")}</DialogTitle>
        <DialogDescription>{t("create.itemTypeDescription")}</DialogDescription>
      </DialogHeader>

      {!isCreatingNew ? (
        <div className="py-4 space-y-4">
          {isLoadingItemTypes ? (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : itemTypes.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {itemTypes.map((itemType: ItemType) => (
                <Button
                  key={itemType.id}
                  variant={
                    selectedItemType === itemType.id ? "default" : "outline"
                  }
                  onClick={() => handleSelectItemType(itemType.id)}
                >
                  {itemType.name}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              {t("itemType.noItemTypes")}
            </p> // Assuming itemType.noItemTypes key
          )}
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => setIsCreatingNew(true)}
          >
            <PlusCircle className="w-4 h-4" />
            {t("create.newItemType")}
          </Button>
          <Button
            variant="outline"
            onClick={onBack}
            className="w-full"
          >
            {t("create.back")}
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateItemTypeSubmit)}
            className="space-y-6 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("create.itemType")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("create.newItemTypePlaceholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isCreatingItemType}
            >
              {isCreatingItemType ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.creating")}
                </>
              ) : (
                t("create.createItemTypeButton")
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsCreatingNew(false)}
              className="w-full"
            >
              {t("create.back")}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
