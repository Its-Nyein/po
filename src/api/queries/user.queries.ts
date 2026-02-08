import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/user.service";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await userService.getAll();
      return res.data;
    },
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const res = await userService.getById(id);
      return res.data;
    },
  });
}

export function useUserByUsername(username: string) {
  return useQuery({
    queryKey: ["users", "username", username],
    queryFn: async () => {
      const res = await userService.getByUsername(username);
      return res.data;
    },
    enabled: username.length > 0,
  });
}

export function useSearch(q: string) {
  return useQuery({
    queryKey: ["search", q],
    queryFn: async () => {
      const res = await userService.search(q);
      return res.data;
    },
    enabled: q.trim().length > 0,
  });
}
