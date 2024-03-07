import { useState } from "react";
import { useRecoilValue } from "recoil";
import { mutate } from "swr";
import { organizationSelectedState } from "../useCurrentOrganization";

const useRevokeOrganizationAccess = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const organization_id = useRecoilValue(organizationSelectedState);

  const revokeProfileOrganizationAccess = async ({
    profile_id,
    organization_id,
  }) => {
    setIsLoading(true);
    const queryString = organization_id
      ? `?organization_id=${organization_id}`
      : "";
    const url = `/api/organizations/access${queryString}`;
    const mutateUrl = `/api/organizations${queryString}`;
    const mutateProfilesUrl = `/api/profiles${queryString}`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile_id: profile_id,
          organization_id: organization_id,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to upload file.");
      }

      const data = await res.json();
      mutate(mutateUrl);
      mutate(mutateProfilesUrl);
    } catch (err) {
      console.log("Error", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    revokeProfileOrganizationAccess,
    isLoading,
    error,
  };
};

export default useRevokeOrganizationAccess;
