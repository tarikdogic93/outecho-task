import { useInfiniteQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export function useTopics(limit: number, sortBy: string) {
  const query = useInfiniteQuery({
    queryKey: ["topics", sortBy],
    queryFn: async ({ pageParam }) => {
      const response = await client.api.topics["$get"]({
        query: { page: `${pageParam}`, limit: `${limit}`, sortBy },
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
