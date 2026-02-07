import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notification.service";

export function useNotifications() {
  return useQuery({
    queryKey: ["notis"],
    queryFn: async () => {
      const res = await notificationService.getAll();
      return res.data;
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notis"] });
    },
  });
}

export function useMarkOneRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => notificationService.markOneRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notis"] });
    },
  });
}
