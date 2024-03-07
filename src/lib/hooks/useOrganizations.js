import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { fetcher } from "@/lib/utils";
// Import your state management hook

export const useOrganizations = () => {
  const searchParams = useSearchParams();
  const project_id = searchParams.get("project_id");
  const search = searchParams.get("o_s");
  // Get the current organization ID from the state

  const url = useMemo(() => {
    let queryParts = [];
    if (project_id) {
      queryParts.push(`project_id=${project_id}`);
    }
    if (search) {
      queryParts.push(`search=${search}`);
    }
    return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  }, [project_id, search]);

  const { data, error } = useSWR(`/api/organizations${url}`, fetcher);

  const isLoading = !data && !error;
  return {
    url,
    organizations: data,
    isLoading,
    error,
  };
};
