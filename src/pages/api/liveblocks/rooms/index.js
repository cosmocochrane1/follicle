import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { getDraftsGroupName } from "@/lib/utils";
import { fetchRooms } from "@/lib/liveblocks/rooms/fetchRooms";
import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";


/**
 * Get a list of rooms.
 * Filter by sending userId, groupIds, or metadata in the query, otherwise return all.
 * Only allow if authorized with NextAuth and user has access to each room.
 *
 * @param req
 * @param res
 * @param [userId] - Optional, filter to rooms with this userAccess set
 * @param [groupIds] - Optional, filter to rooms with these groupIds set (comma separated)
 * @param [documentType] - Optional, filter for this type of document e.g. "canvas"
 * @param [drafts] - Optional, retrieve only draft rooms
 * @param [limit] - Optional, the amount of rooms to retrieve
 */
async function GET(
  req,
  res,
) {
  const groupIds = (req.query.groupIds) ?? undefined;
  const documentType = (req.query.documentType) ?? undefined;
  const drafts = !!req.query.drafts;
  const limit = parseInt(req.query.limit);
  const groupIdsArray = groupIds ? groupIds.split(",") : [];

  // Create authenticated Supabase Client
  const { user } = await serverGetUserFromSupabaseAuth(req, res);

  const userId = user.id;

  // Build getRooms arguments
  const metadata = {};
  if (documentType) {
    metadata["type"] = 'whiteboard';
  }

  let getRoomsOptions = {
    limit,
    metadata,
  };

  const draftGroupName = getDraftsGroupName(userId);
  if (drafts) {
    // Drafts are stored as a group that uses the userId
    getRoomsOptions = {
      ...getRoomsOptions,
      groupIds: [draftGroupName],
    };
  } else {
    // Not a draft, use other info
    getRoomsOptions = {
      ...getRoomsOptions,
      groupIds: groupIdsArray.filter((id) => id !== draftGroupName),
      userId: userId,
    };
  }

  const [rooms] = await Promise.all([
    fetchRooms(getRoomsOptions),
  ]);

  // Call Liveblocks API and get rooms
  const { data, error } = rooms;

  if (error || !data) {
    return res.status(400).json({ error });
  }

  // if you want to check next page
  // const result = {
  //   rooms: data.data,
  //   nextPage: data.nextPage,
  // };

  res.status(200).json(data.data);
}

export default async function liveblocksRooms(req, res) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);

    default:
      return res.status(405).json({
        error: {
          code: 405,
          message: "Method Not Allowed",
          suggestion: "Only GET is available from this API",
        },
      });
  }
}
