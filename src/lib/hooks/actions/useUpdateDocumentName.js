import { useState } from 'react';
import { mutate } from 'swr';
import { useDocuments } from '../useDocuments';
import { useRecoilValue } from 'recoil';
import { organizationSelectedState } from '../useCurrentOrganization';

const useUpdateDocumentName = () => {
  const { url } = useDocuments();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const organization_id = useRecoilValue(organizationSelectedState);

  const updateDocumentName = async ({ documentId, name }) => {
    setIsLoading(true);
    const queryString = organization_id ? `?organization_id=${organization_id}` : '';
    
    try {
      const res = await fetch(`/api/documents/${documentId}${queryString}`, {
        method: 'PATCH',  // Assuming you use PATCH for updating
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update document name.');
      }

      const data = await res.json();

      // If you have a list of documents also you might want to update that as well
      mutate(`/api/documents${queryString}`);

      // if theres some query params update those
      if (url) {
        mutate(`/api/documents${url}`);
      }

      // Re-fetch the document list or the individual document after successful update
      mutate(`/api/document/${documentId}`);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateDocumentName,
    isLoading,
    error,
  };
};

export default useUpdateDocumentName;
