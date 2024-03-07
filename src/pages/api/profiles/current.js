import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";

async function GET(req, res) {
  // Create authenticated Supabase Client and get session
  const { user } = await serverGetUserFromSupabaseAuth(req, res);
  res.status(200).json(user);
}

async function PUT(req, res) {
  // Create authenticated Supabase Client and get session
  const { organization, supabase, user } = await serverGetUserFromSupabaseAuth(
    req,
    res,
  );

  const { full_name, username, scope_access, avatar_url } = req.body;

  const { data: updatedUser, error: errorUpdateUser } = await supabase
    .from("profiles")
    .update({ full_name, username, avatar_url })
    .eq("id", user.id)
    .select("id")
    .single();

  if (scope_access) {
    const { data: updatedScope, error: errorUpdateScope } = await supabase
      .from("profile_organizations")
      .update({ scope_access })
      .eq("profile_id", updatedUser.id)
      .eq("organization_id", organization.id)
      .single();

    if (errorUpdateScope) {
      console.error("Error updating profile ", {
        errorUpdateScope,
      });

      return res.status(500).json({ error: errorUpdateScope });
    }
  }

  if (errorUpdateUser) {
    console.error("Error updating profile ", {
      errorUpdateUser,
    });
    return res.status(500).json({ error: errorUpdateUser });
  }

  res.status(200).json(updatedUser);
}

export default async function currentUser(req, res) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);
    case "PUT":
      return await PUT(req, res);

    default:
      return res.status(405).json({
        error: {
          code: 405,
          message: "Method Not Allowed",
          suggestion: "Only GET and PUT is available from this API",
        },
      });
  }
}
