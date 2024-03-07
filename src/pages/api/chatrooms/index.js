import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";

async function GET(req, res) {
  const { supabase, error } = await serverGetUserFromSupabaseAuth(req, res);
  if (error) {
    console.error("Supabase error organizations:", error);
    return res.status(500).json({ error: "Internal server error" });
  }

  try {
    const projectId = req.query?.project_id;
    const documentId = req.query?.document_id;

    // Get All chatrooms
    if (!projectId && !documentId) {
      const { data, error } = await supabase
        .from("chatrooms")
        .select(`*, profile_chatrooms( profiles ( * ) ), messages( *, sender:sender_id( * ) )`);

      if (error) {
        return res.status(500).json({ error });
      }
      res.status(200).json(data.chatrooms);
    }

    // Get One chatroom by documentId || projectId
    if (documentId || projectId) {
      const tableName = (documentId && 'documents') ?? (projectId && 'projects');
      const { data, error } = await supabase
        .from(tableName)
        .select(`chatrooms( *, profile_chatrooms( profiles ( * ) ), messages( *, sender:sender_id( * ) ) ), organization_id`)
        .eq('id', documentId ?? projectId)
        .single()
        ;
      if (error) {
        return res.status(500).json({ error });
      }

      // Append everyone if organization to profile_chatrooms
      const { data: poData, error: poError } = await supabase
        .from('profile_organizations')
        .select(' profiles( * )')
        .eq('organization_id', data.organization_id)
        ;

      if (poError) {
        return res.status(500).json({ poError });
      }

      // Send hash map of profiles in chatroom combined with profiles in organization
      const chatroomProfilesArr = data.chatrooms.profile_chatrooms.map(arr => arr.profiles);
      const organizationProfilesArr = poData.map(arr => arr.profiles);
      const profilesHash = [...chatroomProfilesArr, ...organizationProfilesArr].reduce((a, v) => ({ ...a, [v.id]: v }), {});

      res.status(200).json({
        chatroom: data.chatrooms,
        profiles: profilesHash
      });
    }

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);
    default:
      return res.status(405).json({
        error: {
          code: 405,
          message: "Method Not Allowed",
          suggestion: "only GET is available from this API",
        },
      });
  }
}
