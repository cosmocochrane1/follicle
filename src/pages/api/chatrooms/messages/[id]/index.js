import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";

async function GET(req, res) {
  const { supabase, error } = await serverGetUserFromSupabaseAuth(req, res);
  if (error) {
    return res.status(500).json({ error });
  }
  try {
    const id = req.query?.id
    if (!id) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "Bad Request",
          suggestion: "message/:id is required",
        },
      });
    }
    const { data, error } = await supabase
      .from("messages")
      .select(`*, sender:sender_id( * )`)
      .eq('id', id)
      .single();
    ;
    if (error) {
      return res.status(500).json({ error });
    }
    res.status(200).json(data);
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
          suggestion: "Only GET is available from this API",
        },
      });
  }
}
