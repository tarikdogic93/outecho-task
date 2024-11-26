import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.topics.create)["$post"]
>;
type RequestType = InferRequestType<(typeof client.api.topics.create)["$post"]>;

export function useTopicCreate() {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.topics.create["$post"]({ json });

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
      queryClient.invalidateQueries({ queryKey: ["topics"] });

      toast.success(data.message);
    },
  });

  return mutation;
}
