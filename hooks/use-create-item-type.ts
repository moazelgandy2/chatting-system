import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createItemType as createItemTypeAction } from "@/actions/packages";

interface CreateItemTypeRequest {
  name: string;
}

interface CreateItemTypeResponse {
  status: boolean;
  errorNum: number;
  message: string;
  data: {
    name: string;
    updated_at: string;
    created_at: string;
    id: number;
  };
}

const createItemType = async (
  itemTypeData: CreateItemTypeRequest
): Promise<CreateItemTypeResponse> => {
  const formData = new FormData();
  formData.append("name", itemTypeData.name);

  const response = await fetch(
    "http://192.168.1.30/ChattingSystem/public/api/item-types/create",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create item type");
  }

  return response.json();
};

export const useCreateItemType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createItemTypeAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itemTypes"] });
      toast.success("Item type created successfully.");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create item type: ${error.message}`);
    },
  });
};
