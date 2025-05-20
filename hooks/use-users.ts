import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/actions/users";
import { USERS_QUERY_KEY } from "./use-create-user";

export interface UserType {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  role: string;
}

export interface UsersApiResponse {
  current_page: number;
  data: UserType[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: { url: string | null; label: string; active: boolean }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export function useUsers(page = 1, search = "") {
  return useQuery<UsersApiResponse>({
    queryKey: [USERS_QUERY_KEY, page, search],
    queryFn: () => fetchUser(page, search),
  });
}

export function useTeamMembers(page = 1, search = "") {
  const query = useUsers(page, search);
  return {
    ...query,
    data: query.data
      ? {
          ...query.data,
          data: query.data.data.filter((u) => u.role === "team"),
        }
      : undefined,
  };
}
