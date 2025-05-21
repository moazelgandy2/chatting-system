import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPackageItem as createPackageItemAction } from "@/actions/packages";

interface CreatePackageItemRequest {
  package_id: number;
  type_id: number;
  status: string;
  notes: string;
  created_by: number;
}

interface CreatePackageItemResponse {
  status: boolean;
  errorNum: number;
  message: string;
  data: any; // Adjust based on actual response data structure if needed
}

const createPackageItem = async (
  itemData: CreatePackageItemRequest
): Promise<CreatePackageItemResponse> => {
  const response = await fetch(
    "http://192.168.1.30/ChattingSystem/public/api/package-items",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create package item");
  }

  return response.json();
};

export const useCreatePackageItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPackageItemAction,
    onSuccess: () => {
      toast.success("Package item created successfully.");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create package item: ${error.message}`);
    },
  });
};
