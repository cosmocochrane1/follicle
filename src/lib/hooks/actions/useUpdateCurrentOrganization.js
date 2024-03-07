import { useState } from "react";
import { useRecoilValue } from "recoil";
import { mutate } from "swr";
import { organizationSelectedState } from "../useCurrentOrganization";

const useUpdateCurrentOrganization = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const organization_id = useRecoilValue(organizationSelectedState);

  // payload = { thumbnail_url: "https://...", name: "New Name"}
  const updateOrganization = async (payload = {}) => {
    setIsLoading(true);
    const queryString = organization_id
      ? `?organization_id=${organization_id}`
      : "";
    const url = `/api/organizations/current${queryString}`;

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to upload file.");
      }

      const updated = await res.json();
      mutate(url, updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateOrganization,
    isLoading,
    error,
  };
};

export default useUpdateCurrentOrganization;
