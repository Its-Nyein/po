import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { messageService } from "../services/message.service";
import type { Conversation, Message } from "@/types/message";

export function useConversations() {
  return useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: () => messageService.getConversations().then((res) => res.data),
  });
}

export function useMessages(conversationId: number) {
  return useInfiniteQuery<Message[]>({
    queryKey: ["messages", conversationId],
    queryFn: ({ pageParam }) =>
      messageService
        .getMessages(conversationId, pageParam as number | undefined)
        .then((res) => res.data),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length < 30) return undefined;
      return lastPage[lastPage.length - 1]?.id;
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      conversationId,
      content,
    }: {
      conversationId: number;
      content: string;
    }) => messageService.sendMessage(conversationId, content),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => messageService.createConversation(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: number) =>
      messageService.markRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["unreadMessages"] });
    },
  });
}

export function useUnreadMessageCount() {
  return useQuery<number>({
    queryKey: ["unreadMessages"],
    queryFn: () =>
      messageService.getUnreadCount().then((res) => res.data.count),
  });
}

export function useCanMessage(userId: number) {
  return useQuery<boolean>({
    queryKey: ["canMessage", userId],
    queryFn: () =>
      messageService.canMessage(userId).then((res) => res.data.canMessage),
    enabled: userId > 0,
  });
}
