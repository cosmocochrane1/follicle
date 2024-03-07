
import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";
import { Liveblocks } from "@liveblocks/node";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { nanoid } from "nanoid";

const API_KEY = process.env.LIVEBLOCKS_SECRET_KEY;

const liveblocks = new Liveblocks({
  secret: API_KEY,
});

export default async function auth(req, res) {
  if (!API_KEY) {
    return res.status(403).end();
  }
  // Create authenticated Supabase Client and get session
  const { user, supabase } = await serverGetUserFromSupabaseAuth(req, res);
  
  // anonymous user id
  const anonId = nanoid();

  // check to see if user exists on the session object, otherwise use anonymous
  const anonymousUser = {
    id: anonId,
    username: "Anonymous",
    email: "none",
    image: "N/A",
  };
  const { id: userId } = user ?? anonymousUser;
  const { username, full_name, avatar_url, email } = user ?? anonymousUser;

  // We're generating users and avatars here based off of Google SSO metadata.
  // This is where you assign the
  // user based on their real identity from your auth provider.
  // See https://liveblocks.io/docs/api-reference/liveblocks-node#authorize for more information
  const liveblocksSession = liveblocks.prepareSession(`${userId}`, {
    userInfo: {
      name: username || full_name || email,
      email: email,
      avatar_url: avatar_url,
    },
  });

  const document_id = req.body.room;
  // Step 1: Fetch user's access level to this document
  const { data, error } = await supabase
    .from('profile_documents')
    .select('scope_access')
    .eq('document_id', document_id)
    .eq('profile_id', userId)
    .single();

  // Step 2: Check user's access level
  if (data) {
    const userAccess = data.scope_access;

    if (userAccess === 'write' || userAccess === 'admin') {
      liveblocksSession.allow(req.body.room, ["room:write", "comments:write"]);
    } else if (userAccess === 'read') {
      liveblocksSession.allow(req.body.room, ["room:read", "room:presence:write", "comments:write"]);
    } else {
      // for now just give everyone read access at least write comments, later change this to read or error unauthorized
      liveblocksSession.allow(req.body.room, ["room:read", "room:presence:write", "comments:write"]);
      // return res.status(403).json({ error: "Unauthorized" });
    }
  } else {
    // No access record found for this user and document
    // for now just give everyone read access at least write comments, later change this to read or error unauthorized
    liveblocksSession.allow(req.body.room, ["room:read", "room:presence:write", "comments:write"]);
    // return res.status(403).json({ error: "Unauthorized" });
  }
  const { status, body } = await liveblocksSession.authorize();
  return res.status(status).end(body);
}
