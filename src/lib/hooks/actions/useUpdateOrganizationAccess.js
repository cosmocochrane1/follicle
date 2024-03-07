import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { mutate } from 'swr';
import { organizationSelectedState } from '../useCurrentOrganization';

const useUpdateOrganizationAccess = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const organization_id = useRecoilValue(organizationSelectedState);

  const updateProfileOrganizationAccess = async ({
    profile_id,
    organization_id,
    scopeAccess,
  }) => {
    setIsLoading(true);
    const queryString = organization_id ? `?organization_id=${organization_id}` : '';
    const url = `/api/organizations/access${queryString}`;
    const mutateUrl = `/api/organizations${queryString}`;
    const mutateProfilesUrl = `/api/profiles${queryString}`;

    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile_id: profile_id,
          organization_id: organization_id,
          scopeAccess: scopeAccess,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to upload file.');
      }

      const data = await res.json();
      mutate(mutateUrl);
      mutate(mutateProfilesUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfileOrganizationAccess,
    isLoading,
    error,
  };
};

export default useUpdateOrganizationAccess;
