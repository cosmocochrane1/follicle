import useSWR from "swr";
import { fetcher } from "../utils";
import { useMemo } from "react";

/**
 * Build the URL for the getRooms API endpoint
 *
 * Get a list of rooms by groupId, userId, and metadata
 * Uses custom API endpoint
 *
 * @param project_ids - The projects to filter for
 * @param userId - The user to filter for
 * @param documentType - The document type to filter for
 * @param drafts - Get only drafts
 * @param limit - The amount of documents to retrieve
 */
function buildRoomUrl({
  project_ids,
  userId,
  documentType,
  drafts = false,
  limit,
}) {
  let url = `?`;

  if (userId) {
    url += `&userId=${userId}`;
  }

  if (project_ids) {
    url += `&groupIds=${project_ids}`;
  }

  if (documentType) {
    url += `&documentType=${documentType}`;
  }

  if (drafts === true) {
    url += `&drafts=${true}`;
  }

  if (limit) {
    url += `&limit=${limit}`;
  }

  return url;
}

export const useRooms = ({
  project_ids,
  documentType,
  drafts = false,
  limit,
}) => {
  const url = useMemo(() => buildRoomUrl({
    project_ids,
    documentType,
    drafts,
    limit,
  }), [project_ids, documentType, drafts, limit]);

  const { data, error } = useSWR(`/api/liveblocks/rooms${url}`, fetcher);

  const isLoading = !data && !error;
  return {
    rooms: data,
    isLoading,
    error,
  };
};


