import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.topics)[":topicId"]["comments"][":commentId"]["$delete"]
>;
type RequestType = InferRequestType<
  (typeof client.api.topics)[":topicId"]["comments"][":commentId"]["$delete"]
>;

export function useDeleteComment(topicId: string, commentId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
      const response = await client.api.topics[":topicId"]["comments"][
        ":commentId"
      ]["$delete"]({
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
    onSuccess: (data) => {
      queryClient.invalidateQueries();

      toast.success(data.message);
    },
  });

  return mutation;
}
