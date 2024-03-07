import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

// The location of the liveblocks custom API endpoints
export const API_BASE_URL = "https://api.liveblocks.io";

const client = createClient({
  throttle: 16,
  authEndpoint: "/api/liveblocks/auth",
  // publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY,
});

// Optionally, Storage represents the shared document that persists in the
// Room, even after all Users leave. Fields under Storage typically are
// LiveList, LiveMap, LiveObject instances, for which updates are
// automatically persisted and synced to all connected clients.
export const {
  suspense: {
    RoomProvider,
    useCanRedo,
    useCanUndo,
    useHistory,
    useMutation,
    useOthers,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
    useUser,
    useRoom,
    useSelf,
    useStorage,
    useUpdateMyPresence,
    useErrorListener,
    useThreads,
    useCreateThread,
    useEditThreadMetadata,
  },
} = createRoomContext(client, {
  resolveUser: async ({ userId }) => {
    try {
      const url = `/api/profiles/${userId}`;
      const response = await fetch(url);
      const user = await response.json();
      const name =
        (user.full_name !== "Anonymous" &&
          user.full_name !== "anonymous" &&
          user.full_name) ||
        user.username ||
        user.email ||
        "Anonymous";
      return {
        name,
        id: user?.id || "anon",
        email: user?.email || "anon",
        avatar:
          user.avatar_url ||
          `https://source.boringavatars.com/bauhaus/120/${name}`,
      };
    } catch (error) {
      console.log("error: ", error);
      console.error(123, error);
    }
  },
  resolveMentionSuggestions: async ({ text }) => {
    try {
      const url = `/api/profiles?search=${text}`;
      const response = await fetch(url);
      const json = await response.json();

      return json.map((user) => user.id);
    } catch (error) {
      console.log("error: ", error);
      console.error(456, error);
      return [];
    }
  },
});
