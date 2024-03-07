import { useCallback, useState } from "react";
import { mutate } from "swr";
import { useDocuments } from "../useDocuments";
import { useRecoilValue } from "recoil";
import { organizationSelectedState } from "../useCurrentOrganization";
import { useSearchParams } from "next/navigation";
import { useDocument } from "../useDocument";

const useUpdateDocumentOrder = () => {
  const { url } = useDocuments();
  const { url: documentUrl } = useDocument();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const organization_id = useRecoilValue(organizationSelectedState);
  const searchParams = useSearchParams();
  const project_id = searchParams.get("project_id");
  const document_id = searchParams.get("document_id");

  const updateDocumentOrder = useCallback(
    async ({ documentId, order }) => {
      setIsLoading(true);
      let queryString = organization_id
        ? `?organization_id=${organization_id}`
        : "";

      queryString = project_id ? `${queryString}&project_id=${project_id}` : "";

      try {
        const res = await fetch(
          `/api/documents/${documentId}/order${queryString}`,
          {
            method: "PATCH", // Assuming you use PATCH for updating
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order,
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Failed to update document order.");
        }

        const data = await res.json();

        // If you have a list of documents also you might want to update that as well
        mutate(`/api/documents${queryString}`);

        // if theres some query params update those
        if (url) {
          mutate(`/api/documents${url}`);
        }

        if (document_id !== null && document_id !== documentId) {
          mutate(`/api/documents/${document_id}${documentUrl ?? ""}`);
        }

        // Re-fetch the document list or the individual document after successful update
        mutate(`/api/documents/${documentId}${documentUrl ?? ""}`);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [document_id, project_id, organization_id, url, documentUrl]
  );

  return {
    updateDocumentOrder,
    isLoading,
    error,
  };
};

export default useUpdateDocumentOrder;
