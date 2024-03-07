import { useState } from "react";
import { useRecoilValue } from "recoil";
import { mutate } from "swr";
import { organizationSelectedState } from "../useCurrentOrganization";

const useGrantOrganizationAccess = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const organization_id = useRecoilValue(organizationSelectedState);

  const grantProfileOrganizationAccess = async ({
    profile_id,
    organization_id,
    scopeAccess,
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile_id: profile_id,
          organization_id: organization_id,
          scopeAccess: scopeAccess,
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
    grantProfileOrganizationAccess,
    isLoading,
    error,
  };
};

export default useGrantOrganizationAccess;
