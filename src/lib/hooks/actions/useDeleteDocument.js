import { useMemo, useState } from "react";
import { mutate } from "swr";
import { useRecoilValue } from "recoil";
import { organizationSelectedState } from "../useCurrentOrganization";
import { useSearchParams } from "next/navigation";

const useDeleteDocument = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const project_id = searchParams.get("project_id");
  const document_id = searchParams.get("document_id");
  // Get the current organization ID from the state
  const organization_id = useRecoilValue(organizationSelectedState);

  const url = useMemo(() => {
    let queryParts = [];
    if (project_id) {
      queryParts.push(`project_id=${project_id}`);
    }
    if (document_id) {
      queryParts.push(`document_id=${document_id}`);
    }
    if (organization_id) {
      queryParts.push(`organization_id=${organization_id}`);
    }
    return queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  }, [project_id, document_id, organization_id]);

  const deleteDocument = async (documentId) => {
    setIsLoading(true);

    try {
      const res = await fetch(`/api/documents/${documentId}${url}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete document.");
      }

      // Update the document list after successful deletion
      mutate(`/api/documents${url}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteDocument,
    isLoading,
    error,
  };
};

export default useDeleteDocument;
