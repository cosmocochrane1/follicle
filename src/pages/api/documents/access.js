import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";

async function POST(req, res) {
  const { user, supabase, error } = await serverGetUserFromSupabaseAuth(req, res);

  try {
    const { 
      profile_id,
      documentId,
    } = req.body;

    // Create a document record
    const { data: invitedProfile, error: createDocError } = await supabase
      .from('profile_documents')
      .insert({
        profile_id: profile_id,
        document_id: documentId,
      }).select().single();

    if (createDocError) {
      throw new Error(createDocError.message);
    }

    res.status(201).json({
      message: "Added to documents",
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
      documentId,
      scopeAccess
    } = req.body;

    const { data: updatedProfileDocumentAccess, error } = await supabase
      .from("profile_documents")
      .update({ scope_access: scopeAccess })
      .eq("profile_id", profile_id)
      .eq("document_id", documentId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    res.status(201).json({
      message: "Added to documents",
      status: "success",
      scope: updatedProfileDocumentAccess,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



export default async function documentsAccess(req, res) {
  switch (req.method) {
    case "POST":
      return await POST(req, res);
    case "PATCH":
      return await PATCH(req, res);

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
