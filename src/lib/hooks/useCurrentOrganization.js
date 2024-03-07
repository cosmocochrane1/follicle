import { fetcher } from "@/lib/utils";
import { useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import useSWR from "swr";

const ORGANIZATION_STORAGE_KEY = "o_id"; // Key for localStorage

// Define a function to get the initial state from localStorage
const getInitialState = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(ORGANIZATION_STORAGE_KEY) || null;
  }
  return null;
};

// Recoil atom for keeping track of the selected organization ID
export const organizationSelectedState = atom({
  key: "organization:selected",
  default: getInitialState(), // Use the function to get the initial state
});

export const useCurrentOrganization = () => {
  const [selectedOrgId, setSelectedOrgId] = useRecoilState(
    organizationSelectedState,
  );

  // Update localStorage when selectedOrgId changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (selectedOrgId) {
        localStorage.setItem(ORGANIZATION_STORAGE_KEY, selectedOrgId);
      } else {
        localStorage.removeItem(ORGANIZATION_STORAGE_KEY);
      }
    }
  }, [selectedOrgId]);

  const endpoint = selectedOrgId
    ? `/api/organizations/current?organization_id=${selectedOrgId}`
    : "/api/organizations/current";

  const { data, error } = useSWR(endpoint, fetcher);
  const isLoading = !data && !error;

  useEffect(() => {
    if (data && data.id !== selectedOrgId) {
      setSelectedOrgId(data.id);
    }
  }, [data, selectedOrgId, setSelectedOrgId]);

  return {
    currentOrganization: data,

    isLoading,
    error,
    setSelectedOrgId,
  };
};
