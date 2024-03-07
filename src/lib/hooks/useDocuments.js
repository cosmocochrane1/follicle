import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { fetcher } from "@/lib/utils";
// Import your state management hook
import { useRecoilValue } from "recoil"; // For example, using Recoil
import { organizationSelectedState } from "./useCurrentOrganization";

export const useDocuments = () => {
  const searchParams = useSearchParams();
  const project_id = searchParams.get("project_id");
  const search = searchParams.get("d_s");
  // Get the current organization ID from the state
  const organization_id = useRecoilValue(organizationSelectedState);

  const url = useMemo(() => {
    let queryParts = [];
    if (project_id) {
      queryParts.push(`project_id=${project_id}`);
    }
    if (search) {
      queryParts.push(`search=${search}`);
    }
    if (organization_id) {
      queryParts.push(`organization_id=${organization_id}`);
    }
    return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  }, [project_id, search, organization_id]);

  const { data, error } = useSWR(`/api/documents${url}`, fetcher);

  const isLoading = !data && !error;
  return {
    url,
    documents: data,
    isLoading,
    error,
  };
};
