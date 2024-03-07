import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";

async function GET(req, res) {
  // Create authenticated Supabase Client and get session
  const { user, supabase, organization } = await serverGetUserFromSupabaseAuth(
    req,
    res
  );

  if (!organization) {
    return res
      .status(403)
      .json({ error: "No organization found in the user's session" });
  }

  try {
    const { search, user_ids } = req.query;
    // Fetch profiles that are part of the current organization
    const query = supabase
      .from("profile_organizations")
      .select(
        `
      *,
      scope_access,
      scope:scope_access(*),
      profile_id,
      profile:profile_id(*)
    `
      )
      .eq("organization_id", organization.id);

    if (search) {
      query
        .ilike("profile.email", `%${search}%`)
        .or(`profile.full_name.ilike.%${search}%`)
        .or(`profile.username.ilike.%${search}%`);
    }

    if (user_ids) {
      const idsArray = user_ids.split(",").map((id) => id.trim());
      query.in("profile_id", idsArray);
    }

    const { data: profileList, error } = await query;

    if (error) {
      console.error("Error fetching profiles:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Extract just the profile information
    const profiles = profileList.map((item) => ({
      ...item.profile,
      scope: item.scope,
      scope_access: item.scope_access,
    }));

    res.status(200).json(profiles);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default async function profiles(req, res) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);

    default:
      return res.status(405).json({
        error: {
          code: 405,
          message: "Method Not Allowed",
          suggestion: "Only GET and POST are available from this API",
        },
      });
  }
}
