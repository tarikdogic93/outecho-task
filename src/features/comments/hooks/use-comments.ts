import { useInfiniteQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export function useComments(topicId: string, limit: number) {
  const query = useInfiniteQuery({
    queryKey: ["comments"],
    queryFn: async ({ pageParam }) => {
      const response = await client.api.comments[":topicId"]["$get"]({
        param: { topicId },
        query: { page: `${pageParam}`, limit: `${limit}` },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      return data;
    },
    initialPageParam: 1,
    staleTime: 0,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage && lastPage.pagination.totalPages <= lastPageParam) {
        return undefined;
      }

      return lastPageParam + 1;
    },
  });

  return query;
}
