import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const useDoctors = (externalVariable) => {
  // Get the current organization ID from the state
  const searchParams = useSearchParams();
  const specialties = searchParams.get("specialties");
  const location = searchParams.get("location");
  debugger;
  const url = useMemo(() => {
    let queryParts = [];
    if (specialties) {
      queryParts.push(`specialties=${specialties}`);
    }
    if (location) {
      queryParts.push(`location=${location}`);
    }
    return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  }, [specialties, location, externalVariable]);

  const { data, error } = useSWR(`/api/doctor${url}`, fetcher);

  const isLoading = !data && !error;
  return {
    doctors: data,
    isLoading,
    error,
  };
};
