import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.comments)[":commentId"]["update"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.comments)[":commentId"]["update"]["$post"]
>;

export function useUpdateComment(commentId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.comments[":commentId"]["update"][
        "$post"
      ]({
        json,
        param: { commentId },
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
      queryClient.invalidateQueries({ queryKey: ["comments"] });

      toast.success(data.message);
    },
  });

  return mutation;
}
