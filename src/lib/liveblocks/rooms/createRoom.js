import { fetchLiveblocksApiEndpoint } from "@/lib/liveblocks/fetchLiveblocksApiEndpoint";


/**
 * Create Room
 *
 * Create a new room with a number of params.
 * Uses Liveblocks API
 *
 * @param id - The id of the room
 * @param metadata - The room's metadata
 * @param usersAccesses - Which users are allowed in the room
 * @param groupsAccesses - Which groups are allowed in the room
 * @param defaultAccesses - Default accesses for room
 */
export async function createRoom({
  id,
  metadata,
  usersAccesses,
  groupsAccesses,
  defaultAccesses = [],
}) {
  const url = "/v2/rooms";

  const payload = JSON.stringify({
    id,
    metadata,
    usersAccesses,
    groupsAccesses,
    defaultAccesses,
  });

  return fetchLiveblocksApiEndpoint(url, {
    method: "POST",
    body: payload,
  });
}
