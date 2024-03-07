import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";

async function GET(req, res) {
  const profileId = req.query.profile_id;
  if (!profileId) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Bad Request",
        suggestion: "profile_id is required",
      },
    });
  }

  const { supabase, organization } = await serverGetUserFromSupabaseAuth(
    req,
    res
  );

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .single();

  if (error) {
    return res.status(500).json({ error });
  }

  if (!profile) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Group Not Found",
        suggestion: `No users found for authenticated user.`,
      },
    });
  }

  res.status(200).json(profile);
}

export default async function profile(req, res) {
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
