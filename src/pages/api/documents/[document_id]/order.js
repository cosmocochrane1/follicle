import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";

async function PATCH(req, res) {
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

  const { order } = req.body;
  if (!order) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Bad Request",
        suggestion: "New order is required",
      },
    });
  }

  // Fetch current documents in the project
  const { data: currentDocuments, error: fetchError } = await supabase
    .from("documents")
    .select("*")
    .eq("project_id", project_id)
    .eq("organization_id", organization.id);

  if (fetchError) {
    return res.status(500).json({ error: fetchError });
  }

  const currentOrder = currentDocuments.find(
    (doc) => doc.id === document_id
  ).order;

  // Rearrange the order of documents
  const reorderedDocuments = currentDocuments.map((d) => {
    const { chatroom_id, ...doc } = d;
    if (doc.id === document_id) {
      // Update the order of the moved document
      return { ...doc, order: order };
    } else if (currentOrder < order) {
      // Moving down: Increase order of documents between the old and new positions
      if (doc.order > currentOrder && doc.order <= order) {
        return { ...doc, order: doc.order - 1 };
      }
    } else if (currentOrder > order) {
      // Moving up: Decrease order of documents between the old and new positions
      if (doc.order >= order && doc.order < currentOrder) {
        return { ...doc, order: doc.order + 1 };
      }
    }
    return doc;
  });

  const { data, error } = await supabase
    .from("documents")
    .upsert(reorderedDocuments);

  if (error) {
    return res.status(500).json({ error });
  }

  return res.status(200).json({ message: "Documents reordered successfully" });
}

export default async function group(req, res) {
  switch (req.method) {
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
