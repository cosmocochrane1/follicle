import useSWR from "swr";
import { fetcher } from "@/lib/utils";

export const useBucket = (bucketId, path) => {
  const url = `/api/buckets/${bucketId}?path=${path}`;
  const { data, error } = useSWR(url, fetcher);
  const isLoading = !data && !error;

  return {
    data,
    isLoading,
    error,
  };
};
