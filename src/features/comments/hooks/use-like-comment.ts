import { InferResponseType } from "hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.topics)[":topicId"]["comments"][":commentId"]["like"]["$post"]
>;

export function useLikeComment(topicId: string, commentId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.topics[":topicId"]["comments"][
        ":commentId"
      ]["like"]["$post"]({
        param: { topicId, commentId },
      });

      const data = await response.json();

      if (!response.ok) {
        return Promise.reject(data);
      }

      return data;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  return mutation;
}
