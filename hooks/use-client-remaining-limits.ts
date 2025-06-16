import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchClientRemainingLimitsAction,
  type ClientRemainingLimitsResponse,
  type ClientRemainingLimitItem,
} from "@/actions/client-limits-actions";

// Define the expected structure of a single limit item
export type { ClientRemainingLimitItem, ClientRemainingLimitsResponse }; // Re-export types

export const CLIENT_REMAINING_LIMITS_QUERY_KEY = "clientRemainingLimits";

// Function to generate the query key
export const getClientRemainingLimitsQueryKey = (chatId: string) => [
  CLIENT_REMAINING_LIMITS_QUERY_KEY,
  chatId,
];

// Custom hook to use client remaining limits
export const useClientRemainingLimits = (
  chatId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery<ClientRemainingLimitsResponse, Error>({
    queryKey: getClientRemainingLimitsQueryKey(chatId),
    queryFn: () => fetchClientRemainingLimitsAction(chatId), // Use the server action
    enabled: options?.enabled ?? !!chatId, // Enable only if chatId is present and options.enabled is not false
  });
};

export const useClientRemainingLimitsRevalidate = ({
  chatId,
}: {
  chatId: string; // Changed from number to string
}) => {
  const queryClient = useQueryClient();
  console.log(
    "Revalidating client remaining limits for chatId (string):", // Updated log message
    chatId,
    CLIENT_REMAINING_LIMITS_QUERY_KEY
  );
  return () =>
    queryClient.invalidateQueries({
      queryKey: [CLIENT_REMAINING_LIMITS_QUERY_KEY, chatId], // chatId is now a string
    });
};
