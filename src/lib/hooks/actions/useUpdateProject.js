import { useState } from "react";
import { useRecoilValue } from "recoil";
import { mutate } from "swr";
import { organizationSelectedState } from "../useCurrentOrganization";

const useUpdateProject = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const organization_id = useRecoilValue(organizationSelectedState);

  const updateProject = async ({
    id: id,
    name: name,
    description: description,
  }) => {
    setIsLoading(true);
    const queryString = organization_id
      ? `?organization_id=${organization_id}`
      : "";
    const url = `/api/projects${queryString}`;

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          name: name,
          description: description,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update project ${name}.`);
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
    updateProject,
    isLoading,
    error,
  };
};

export default useUpdateProject;
