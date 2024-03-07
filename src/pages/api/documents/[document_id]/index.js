import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";

async function GET(req, res) {
  // Create authenticated Supabase Client and get session
  const documentId = req.query.document_id;
  if (!documentId) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Bad Request",
        suggestion: "document_id is required",
      },
    });
  }

  const { user, supabase, organization } = await serverGetUserFromSupabaseAuth(
    req,
    res
  );

  const { data: document, error } = await supabase
    .from("documents")
    .select(
      `*,  profiles(
      *,
      scope:profile_documents(*)
    ),
    organization:organizations(
      *,
      profiles(
        *,
        scope:profile_organizations(*)
      )
    ),
    project:projects(
      *,
      organization:organizations(
        *,
        profiles(
          *,
          scope:profile_organizations(*)
        )
      ),
      profiles(
        *,
        scope:profile_projects(*)
      )
    )`
    )
    .eq("id", documentId)
    .eq("organization_id", organization.id)
    .single();

  if (error) {
    return res.status(500).json({ error });
  }

  res.status(200).json(document);
}

async function PATCH(req, res) {
  const documentId = req.query.document_id;
  if (!documentId) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Bad Request",
        suggestion: "document_id is required",
      },
    });
  }

  const { user, supabase, organization } = await serverGetUserFromSupabaseAuth(
    req,
    res
  );

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
    .from("documents")
    .update({ name })
    .eq("id", documentId)
    .eq("organization_id", organization.id)
    .single();

  if (error) {
    return res.status(500).json({ error });
  }

  return res.status(200).json(updatedDocument);
}

async function DELETE(req, res) {
  const { project_id, document_id } = req.query;
  if (!document_id) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Bad Request",
        suggestion: "document_id is required",
      },
    });
  }
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
    // Then delete the document
    const { error: deleteDocumentError } = await supabase
      .from("documents")
      .delete()
      .eq("id", document_id)
      .eq("organization_id", organization.id);

    if (deleteDocumentError) throw deleteDocumentError;

    // Delete document_versions first
    const { error: deleteVersionsError } = await supabase
      .from("document_versions")
      .delete()
      .eq("document_id", document_id);

    if (deleteVersionsError) throw deleteVersionsError;

    // Fetch current documents in the project
    const { data: currentDocuments, error: fetchError } = await supabase
      .from("documents")
      .select("*")
      .eq("project_id", project_id)
      .eq("organization_id", organization.id)
      .order("order", { ascending: true });

    if (fetchError) throw fetchError;

    // Rearrange the order of documents
    const reorderedDocuments = currentDocuments.map((d, i) => {
      const { chatroom_id, ...doc } = d;
      return {
        ...doc,
        order: i + 1,
      };
    });

    const { data, error } = await supabase
      .from("documents")
      .upsert(reorderedDocuments);

    if (error) throw error;

    return res
      .status(200)
      .json({ message: "Document and its versions deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

export default async function group(req, res) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);
    case "PATCH":
      return await PATCH(req, res);
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
