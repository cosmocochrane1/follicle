import { compareAccessLevels } from "@/lib/access";
import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";
import { Liveblocks } from "@liveblocks/node";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { nanoid } from "nanoid";

const API_KEY = process.env.LIVEBLOCKS_SECRET_KEY;
const liveblocks = new Liveblocks({ secret: API_KEY });

// Add the compareAccessLevels function here (same as in the previous code)

export default async function auth(req, res) {
  if (!API_KEY) {
    return res.status(403).end();
  }

  const { user, supabase } = await serverGetUserFromSupabaseAuth(req, res);
  const anonId = nanoid();
  const anonymousUser = {
    id: anonId,
    username: "Anonymous",
    email: "none",
    image: "N/A",
  };
  const { id: userId } = user ?? anonymousUser;
  const { username, full_name, avatar_url, email } = user ?? anonymousUser;

  const liveblocksSession = liveblocks.prepareSession(`${userId}`, {
    userInfo: {
      name: username || full_name || email,
      email: email,
      avatar_url: avatar_url,
    },
  });

  const document_id = req.body.room;

  try {
    // Fetch user's organization and project IDs as in the GET function
    const [userOrganizations, userProjects] = await Promise.all([
      supabase.from('profile_organizations').select('organization_id').filter('profile_id', 'eq', user.id),
      supabase.from('profile_projects').select('project_id').filter('profile_id', 'eq', user.id)
    ]);

    // Extract IDs
    const userOrganizationIds = userOrganizations.data?.map(org => org.organization_id) || [];
    const userProjectIds = userProjects.data?.map(proj => proj.project_id) || [];

    // Fetch document details
    const { data: documentData } = await supabase.from('documents').select('project_id, organization_id').eq('id', document_id).single();

    // Determine user's access level
    let highestAccess = 'none';

    if (documentData) {
      // Check organization and project access
      const hasOrganizationAccess = userOrganizationIds.includes(documentData.organization_id);
      const hasProjectAccess = userProjectIds.includes(documentData.project_id);

      // Fetch direct document access
      const { data: documentAccessData } = await supabase
        .from('profile_documents')
        .select('scope_access')
        .eq('document_id', document_id)
        .eq('profile_id', userId)
        .single();

      const documentAccess = documentAccessData?.scope_access;

      // Combine access levels and find the highest
      highestAccess = compareAccessLevels(
        compareAccessLevels(documentAccess, hasProjectAccess ? 'read' : undefined),
        hasOrganizationAccess ? 'read' : undefined
      );
    }

    // Set permissions based on highest access level
    if (highestAccess === 'write' || highestAccess === 'admin') {
      liveblocksSession.allow(document_id, ["room:write", "comments:write"]);
    } else if (highestAccess === 'read') {
      liveblocksSession.allow(document_id, ["room:read", "room:presence:write", "comments:write"]);
    } else {
      // Handle no access case
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { status, body } = await liveblocksSession.authorize();
    return res.status(status).end(body);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
