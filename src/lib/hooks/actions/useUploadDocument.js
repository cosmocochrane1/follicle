import { useState } from "react";
import { mutate } from "swr";
import { useRouter, useSearchParams } from "next/navigation";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { nanoid } from "nanoid";
import { v4 as uuidv4 } from "uuid";
import { useCurrentUser } from "../useCurrentUser";
import { useRecoilValue } from "recoil";
import { organizationSelectedState } from "../useCurrentOrganization";

const useUploadDocument = () => {
  const { currentUser, isLoading: currentUserLoading } = useCurrentUser();
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const searchParams = useSearchParams();
  const project_id = searchParams.get("project_id");
  const search = searchParams.get("d_s");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const organization_id = useRecoilValue(organizationSelectedState);

  const uploadDocument = async (file) => {
    if (file && file.type !== "application/pdf") {
      setError("Invalid file type. Please upload a PDF.");
      return;
    }

    if (currentUserLoading) {
      setError("Current user is loading. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      // Here we need to generate a seperate file for each page of the file.
      // if PDF breakdown per page.
      // we also need to generate a thumbnail for each page.
      const generatedDocumentId = uuidv4();
      const storageBucketKey = `${currentUser.organization_id || "all"}/${
        project_id || "no-project"
      }/${generatedDocumentId}/${generatedDocumentId}.pdf`;
      const { data: _, error: uploadError } = await supabaseClient.storage
        .from("documents")
        .upload(storageBucketKey, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      let queryParts = [];
      if (project_id) {
        queryParts.push(`project_id=${project_id}`);
      }
      if (organization_id) {
        queryParts.push(`organization_id=${organization_id}`);
      }
      if (search) {
        queryParts.push(`search=${search}`);
      }
      const queryString =
        queryParts.length > 0 ? `?${queryParts.join("&")}` : "";

      const url = `/api/documents${queryString}`;
      const mutateUrl = `/api/projects${queryString}`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          storageBucketKey,
          project_id,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to upload file.");
      }

      mutate(url);
      mutate(mutateUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadDocument,
    isLoading,
    error,
  };
};

export default useUploadDocument;
