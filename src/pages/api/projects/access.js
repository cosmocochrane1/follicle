import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";

async function POST(req, res) {
  const { user, supabase, error } = await serverGetUserFromSupabaseAuth(req, res);

  try {
    const { 
      profile_id,
      project_id,
    } = req.body;

    // Create a project record
    const { data: invitedProfile, error: createDocError } = await supabase
      .from('profile_projects')
      .insert({
        profile_id: profile_id,
        project_id: project_id,
      }).select().single();

    if (createDocError) {
      throw new Error(createDocError.message);
    }

    res.status(201).json({
      message: "Added to projects",
      status: "success",
      scope: invitedProfile,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function PATCH(req, res) {
  const { user, supabase, error } = await serverGetUserFromSupabaseAuth(req, res);

  try {
    const { 
      profile_id,
      project_id,
      scopeAccess
    } = req.body;

    const { data: updatedProfileProjectAccess, error } = await supabase
      .from("profile_projects")
      .update({ scope_access: scopeAccess })
      .eq("profile_id", profile_id)
      .eq("project_id", project_id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    res.status(201).json({
      message: "Added to projects",
      status: "success",
      scope: updatedProfileProjectAccess,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function DELETE(req, res) {
  const { user, supabase, error } = await serverGetUserFromSupabaseAuth(req, res);

  if (error) {
    return res.status(403).json({ error: error.message });
  }

  try {
    const { profile_id, project_id } = req.body;

    const { data, error: deleteError } = await supabase
      .from('profile_projects')
      .delete()
      .eq('profile_id', profile_id)
      .eq('project_id', project_id);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    res.status(200).json({
      message: "Removed from project",
      status: "success",
      deleted: data
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default async function projectsAccess(req, res) {
  switch (req.method) {
    case "POST":
      return await POST(req, res);
    case "PATCH":
      return await PATCH(req, res);
    case "DELETE":
      return await DELETE(req, res);

    default:
      return res.status(405).json({
        error: {
          code: 405,
          message: "Method Not Allowed",
          suggestion: "Only GET, POST, PATCH, and DELETE are available from this API",
        },
      });
  }
}
