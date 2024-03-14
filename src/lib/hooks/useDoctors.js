import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const useDoctors = () => {
  // Get the current organization ID from the state
  const searchParams = useSearchParams();
  const specialties = searchParams.get("specialties");
  const location = searchParams.get("location");

  const url = useMemo(() => {
    let queryParts = [];
    if (specialties) {
      queryParts.push(`specialties=${specialties}`);
    }
    if (location) {
      queryParts.push(`location=${location}`);
    }
    return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  }, [specialties, location]);
  const { data, error } = useSWR(`/api/doctors${url}`, fetcher);

  const isLoading = !data && !error;
  return {
    doctors: data,
    isLoading,
    error,
  };
};
