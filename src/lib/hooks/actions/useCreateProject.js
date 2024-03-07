import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { mutate } from 'swr';
import { organizationSelectedState } from '../useCurrentOrganization';

const useCreateProject = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const organization_id = useRecoilValue(organizationSelectedState);

  const createProject = async ({
    file: file, // need to do something with this file to create a preview image.
    name: name,
    description: description,
  }) => {
    setIsLoading(true);
    const queryString = organization_id ? `?organization_id=${organization_id}` : '';
    const url = `/api/projects${queryString}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          description: description
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to upload file.');
      }

      const data = await res.json();
      mutate(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createProject,
    isLoading,
    error,
  };
};

export default useCreateProject;
