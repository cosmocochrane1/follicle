import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { useRecoilValue } from "recoil"; // For example, using Recoil
import { organizationSelectedState } from "./useCurrentOrganization";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const useProjects = () => {
  // Get the current organization ID from the state
  const organization_id = useRecoilValue(organizationSelectedState);
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const search = searchParams.get("p_s");

  const url = useMemo(() => {
    let queryParts = [];
    if (filter) {
      queryParts.push(`filter=${filter}`);
    }
    if (search) {
      queryParts.push(`search=${search}`);
    }
    if (organization_id) {
      queryParts.push(`organization_id=${organization_id}`);
    }
    return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  }, [filter, search, organization_id]);

  const { data, error } = useSWR(`/api/projects${url}`, fetcher);

  const isLoading = !data && !error;
  return {
    projects: data,
    isLoading,
    error,
  };
};
