import useSWR from "swr";
import { fetcher } from "../utils";
import { useParams, useSearchParams } from "next/navigation";
import { useRecoilValue } from "recoil";
import { useMemo } from "react";

export const useDoctor = () => {
  const searchParams = useSearchParams();
  const doctor_id = searchParams.get("id");

  // Construct the URL only if doctor_id is present
  const url = useMemo(() => {
    if (!doctor_id) {
      return null;
    }
    let queryParts = [];
    return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  }, [doctor_id]);

  const { data, error } = useSWR(
    !doctor_id ? null : `/api/doctor/${doctor_id}${url}`,
    fetcher,
    { shouldRetryOnError: false }
  );

  const isLoading = !data && !error && !!url;
  return {
    url,
    doctor: data,
    isLoading,
    error,
  };
};
