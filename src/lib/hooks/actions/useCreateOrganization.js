import { useState } from "react";
import { useRecoilValue } from "recoil";
import { mutate } from "swr";
import { organizationSelectedState } from "../useCurrentOrganization";
import { useOrganizations } from "../useOrganizations";

const useCreateOrganization = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const organization_id = useRecoilValue(organizationSelectedState);
  const { url: organizationsUrl } = useOrganizations();

  const createOrganization = async ({
    name: name,
    description: description,
  }) => {
    setIsLoading(true);
    const queryString = organization_id
      ? `?organization_id=${organization_id}`
      : "";
    const url = `/api/organizations${queryString}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          description: description,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to upload file.");
      }

      const data = await res.json();
      mutate(url);
      mutate(`/api/organizations${organizationsUrl}`);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createOrganization,
    isLoading,
    error,
  };
};

export default useCreateOrganization;
