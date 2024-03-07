import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";

async function GET(req, res) {
  const { supabase, error } = await serverGetUserFromSupabaseAuth(req, res);
  if (error) {
    return res.status(500).json({ error });
  }
  try {
    const chatroomId = req.query?.chatroom_id
    if (!chatroomId) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "Bad Request",
          suggestion: "chatroom_id is required",
        },
      });
    }
    const { data, error } = await supabase
      .from("messages")
      .select(`*, sender:sender_id( * )`)
      .eq('chatroom_id', chatroomId)
      ;
    if (error) {
      return res.status(500).json({ error });
    }
    res.status(200).json(data?.messages);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function POST(req, res) {
  const { supabase, user, error } = await serverGetUserFromSupabaseAuth(req, res);
  if (error) {
    console.error("Supabase error organizations:", error);
    return res.status(500).json({ error: "Internal server error" });
  }

  try {
    const { type, content, chatroom_id } = req.body;
    const { data: newMessage, error } = await supabase
      .from("messages")
      .insert({
        type,
        content,
        sender_id: user.id,
        chatroom_id
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error });
    }

    res.status(201).json({
      message: "Added to messages",
      status: "success",
      newMessage,
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);
    case "POST":
      return await POST(req, res);
    default:
      return res.status(405).json({
        error: {
          code: 405,
          message: "Method Not Allowed",
          suggestion: "Only GET and POST are available from this API",
        },
      });
  }
}
