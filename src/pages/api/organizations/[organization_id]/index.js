import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";

async function GET(req, res) {
  // Create authenticated Supabase Client and get session
  const { organization_id } = req.query;
  if (!organization_id) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Bad Request",
        suggestion: "organization_id is required",
      },
    });
  }

  const { user, supabase, organization } = await serverGetUserFromSupabaseAuth(
    req,
    res
  );

  res.status(200).json(organization);
}

async function DELETE(req, res) {
  const { organization_id } = req.query;
  if (!organization_id) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Bad Request",
        suggestion: "organization_id is required",
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
      .eq("organization_id", organization_id); // Assuming 'project_id' is the column in 'documents' table
    if (deleteDocumentsError) throw deleteDocumentsError;

    // First, delete all projects associated with the project
    const { error: deleteProjectsError } = await supabase
      .from("projects")
      .delete()
      .eq("organization_id", organization_id); // Assuming 'project_id' is the column in 'documents' table
    if (deleteProjectsError) throw deleteProjectsError;

    // Then delete the project
    const { error: deleteProjectError } = await supabase
      .from("organizations")
      .delete()
      .eq("id", organization_id);
    if (deleteProjectError) throw deleteProjectError;

    // i need to delete all documents related to this project
    return res.status(200).json({
      message:
        "Organization, its documents, and its projects deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

export default async function organizations(req, res) {
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
