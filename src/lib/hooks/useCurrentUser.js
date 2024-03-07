import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { useRecoilValue } from 'recoil'; // For example, using Recoil
import { organizationSelectedState } from "./useCurrentOrganization";

export const useCurrentUser = () => {
  // Get the current organization ID from the state
  const organization_id = useRecoilValue(organizationSelectedState);

  const url = `/api/profiles/current${organization_id ? `?organization_id=${organization_id}` : ''}`;

  const { data, error } = useSWR(url, fetcher);

  const isLoading = !data && !error;
  return {
    currentUser: data,
    isLoading,
    error,
  };
};
