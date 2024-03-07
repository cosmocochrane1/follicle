import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";

async function GET(req, res) {
  // Create authenticated Supabase Client and get session
  const documentId = req.query.document_version_id;
  if (!documentId) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Bad Request",
        suggestion: "document_id is required",
      },
    });
  }

  const { user, supabase, organization } = await serverGetUserFromSupabaseAuth(req, res);

  const { data: document, error } = await supabase
    .from('document_versions')
    .select('*')
    .eq('id', documentId)
    .eq('organization_id', organization.id)
    .single();

  if (error) {
    return res.status(500).json({ error });
  }

  res.status(200).json(document);
}

async function PATCH(req, res) {
  const documentVersionId = req.query.document_version_id;
  if (!documentVersionId) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Bad Request",
        suggestion: "document_version_id is required",
      },
    });
  }

  const { user, supabase } = await serverGetUserFromSupabaseAuth(req, res);

  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Bad Request",
        suggestion: "New name is required",
      },
    });
  }

  const { data: updatedDocument, error } = await supabase
    .from("document_versions")
    .update({ name })
    .eq("id", documentVersionId)
    .eq("organization_id", user.organization_id)
    .single();

  if (error) {
    return res.status(500).json({ error });
  }

  return res.status(200).json(updatedDocument);
}




export default async function group(req, res) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);
    case "PATCH":
      return await PATCH(req, res);

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
