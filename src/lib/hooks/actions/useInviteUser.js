import { useState } from "react";
import { useRecoilValue } from "recoil";
import { mutate } from "swr";
import { organizationSelectedState } from "../useCurrentOrganization";

const useInviteUser = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const organization_id = useRecoilValue(organizationSelectedState);

  const inviteUser = async ({ email }) => {
    setIsLoading(true);
    const queryString = organization_id
      ? `?organization_id=${organization_id}`
      : "";
    const url = `/api/auth/invite${queryString}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to invite user.");
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inviteUser,
    isLoading,
    error,
  };
};

export default useInviteUser;
