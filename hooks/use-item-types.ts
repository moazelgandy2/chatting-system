import { useQuery } from "@tanstack/react-query";
import { fetchItemTypes } from "@/actions/packages";

export const useItemTypes = () => {
  return useQuery({
    queryKey: ["itemTypes"],
    queryFn: fetchItemTypes,
  });
};
