import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export function useTopic(topicId: string) {
  const query = useQuery({
    queryKey: [topicId],
    queryFn: async () => {
      const response = await client.api.topics[":topicId"]["$get"]({
        param: { topicId },
      });

      if (!response.ok) {
        return null;
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
}
