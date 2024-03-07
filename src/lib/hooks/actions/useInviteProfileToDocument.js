import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { mutate } from 'swr';
import { organizationSelectedState } from '../useCurrentOrganization';

const useInviteProfileToDocument = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const organization_id = useRecoilValue(organizationSelectedState);

  const inviteProfileToDocuemnt = async ({
    profile_id,
    documentId,
  }) => {
    setIsLoading(true);
    const queryString = organization_id ? `?organization_id=${organization_id}` : '';
    const url = `/api/documents/access${queryString}`;
    const mutateUrl = `/api/documents${queryString}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile_id: profile_id,
          documentId: documentId
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to upload file.');
      }

      const data = await res.json();
      mutate(mutateUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inviteProfileToDocuemnt,
    isLoading,
    error,
  };
};

export default useInviteProfileToDocument;
