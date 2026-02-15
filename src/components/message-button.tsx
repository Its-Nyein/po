import {
  useCanMessage,
  useCreateConversation,
} from "@/api/queries/message.queries";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/use-auth";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MessageButtonProps {
  userId: number;
}

export function MessageButton({ userId }: MessageButtonProps) {
  const { user: authUser } = useAuth();
  const { data: canMessage, isLoading } = useCanMessage(userId);
  const createConversation = useCreateConversation();
  const navigate = useNavigate();

  if (!authUser || authUser.id === userId) return null;
  if (isLoading || !canMessage) return null;

  const handleClick = () => {
    createConversation.mutate(userId, {
      onSuccess: (res) => {
        navigate(`/messages/${res.data.id}`);
      },
    });
  };

  return (
    <Button
      size="sm"
      variant="outline"
      className="rounded-full"
      onClick={handleClick}
      disabled={createConversation.isPending}
    >
      <MessageCircle className="size-4 mr-1" />
      Message
    </Button>
  );
}
