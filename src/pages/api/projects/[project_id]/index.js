import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";

async function GET(req, res) {
  // Create authenticated Supabase Client and get session
  const { project_id } = req.query;
  if (!project_id) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Bad Request",
        suggestion: "project_id is required",
      },
    });
  }

  const { user, supabase, organization } = await serverGetUserFromSupabaseAuth(
    req,
    res
  );

  const { data: document, error } = await supabase
    .from("projects")
    .select("*, profiles(*)")
    .eq("id", project_id)
    .eq("organization_id", organization.id)
    .single();

  if (error) {
    return res.status(500).json({ error });
  }

  res.status(200).json(document);
}

async function DELETE(req, res) {
  const { project_id } = req.query;
  if (!project_id) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Bad Request",
        suggestion: "project_id is required",
      },
    });
  }

  const { user, supabase, organization } = await serverGetUserFromSupabaseAuth(
    req,
    res
  );

  try {
    // First, delete all documents associated with the project
    const { error: deleteDocumentsError } = await supabase
      .from("documents")
      .delete()
      .eq("project_id", project_id); // Assuming 'project_id' is the column in 'documents' table

    if (deleteDocumentsError) throw deleteDocumentsError;

    // Then delete the project
    const { error: deleteProjectError } = await supabase
      .from("projects")
      .delete()
      .eq("id", project_id)
      .eq("organization_id", organization.id);

    if (deleteProjectError) throw deleteProjectError;

    // i need to delete all documents related to this project
    return res
      .status(200)
      .json({ message: "Project and its documents deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

export default async function group(req, res) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);
    case "DELETE":
      return await DELETE(req, res);

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
