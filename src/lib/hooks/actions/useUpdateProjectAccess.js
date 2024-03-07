import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { mutate } from 'swr';
import { organizationSelectedState } from '../useCurrentOrganization';

const useUpdateProjectAccess = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const organization_id = useRecoilValue(organizationSelectedState);

  const updateProfileProjectAccess = async ({
    profile_id,
    project_id,
    scopeAccess,
  }) => {
    setIsLoading(true);
    const queryString = organization_id ? `?organization_id=${organization_id}` : '';
    const url = `/api/projects/access${queryString}`;
    const mutateUrl = `/api/projects${queryString}`;
    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile_id: profile_id,
          project_id: project_id,
          scopeAccess: scopeAccess,
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
    updateProfileProjectAccess,
    isLoading,
    error,
  };
};

export default useUpdateProjectAccess;
