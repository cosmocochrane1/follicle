import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";

async function PATCH(req, res) {
  const { user, supabase, error } = await serverGetUserFromSupabaseAuth(
    req,
    res,
  );

  try {
    const { profile_id, organization_id, scopeAccess } = req.body;

    const { data: updatedProfileProjectAccess, error } = await supabase
      .from("profile_organizations")
      .update({ scope_access: scopeAccess })
      .eq("profile_id", profile_id)
      .eq("organization_id", organization_id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    res.status(201).json({
      message: "Added to organization",
      status: "success",
      scope: updatedProfileProjectAccess,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function POST(req, res) {
  const { user, supabase, error } = await serverGetUserFromSupabaseAuth(
    req,
    res,
  );

  try {
    const { profile_id, organization_id, scopeAccess } = req.body;

    // Check if profile organization is already created, return already invited error
    const { data: existingProfileOrganization } = await supabase
      .from("profile_organizations")
      .select("*")
      .eq("profile_id", profile_id)
      .eq("organization_id", organization_id)
      .single();

    if (existingProfileOrganization) {
      return res.status(422).json({
        message: "Already invited",
        status: "error",
      });
    }

    const { data: createdProfileProjectAccess, error } = await supabase
      .from("profile_organizations")
      .insert({ profile_id, organization_id, scope_access: scopeAccess })
      .single();

    if (error) {
      throw new Error(error.message);
    }

    res.status(201).json({
      message: "Added to organization",
      status: "success",
      scope: createdProfileProjectAccess,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function DELETE(req, res) {
  const { user, supabase, error } = await serverGetUserFromSupabaseAuth(
    req,
    res,
  );

  try {
    const { profile_id, organization_id, scopeAccess } = req.body;

    const { data: updatedProfileProjectAccess, error } = await supabase
      .from("profile_organizations")
      .delete()
      .eq("profile_id", profile_id)
      .eq("organization_id", organization_id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    res.status(201).json({
      message: "Removed from organization",
      status: "success",
      scope: updatedProfileProjectAccess,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default async function organizationsAccess(req, res) {
  switch (req.method) {
    case "PATCH":
      return await PATCH(req, res);
    case "POST":
      return await POST(req, res);
    case "DELETE":
      return await DELETE(req, res);

    default:
      return res.status(405).json({
        error: {
          code: 405,
          message: "Method Not Allowed",
          suggestion: "Only GET and POST is available from this API",
        },
      });
  }
}
