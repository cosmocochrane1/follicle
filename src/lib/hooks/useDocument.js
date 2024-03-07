import useSWR from "swr";
import { fetcher } from "../utils";
import { useSearchParams } from "next/navigation";
import { useRecoilValue } from "recoil";
import { organizationSelectedState } from "./useCurrentOrganization";
import { useMemo } from "react";

export const useDocument = () => {
  const searchParams = useSearchParams();
  const document_id = searchParams.get("document_id");
  const project_id = searchParams.get("project_id");
  const organization_id = useRecoilValue(organizationSelectedState);

  // Construct the URL only if document_id is present
  const url = useMemo(() => {
    if (!document_id) {
      return null;
    }
    let queryParts = [];
    if (organization_id) {
      queryParts.push(`organization_id=${organization_id}`);
    }
    if (project_id) {
      queryParts.push(`project_id=${project_id}`);
    }
    return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  }, [document_id, organization_id, project_id]);

  const { data, error } = useSWR(
    !document_id ? null : `/api/documents/${document_id}${url}`,
    fetcher,
    { shouldRetryOnError: false }
  );

  const isLoading = !data && !error && !!url;
  return {
    url,
    document: data,
    isLoading,
    error,
  };
};
