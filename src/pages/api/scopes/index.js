import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

async function GET(req, res) {
  // Create authenticated Supabase Client and get session
  const { supabase } = await serverGetUserFromSupabaseAuth(req, res);

  const { data: scopeList, error } = await supabase
    .from('scopes')
    .select('*');

  if (error) {
    return res.status(500).json({ error });
  }

  res.status(200).json(scopeList);
}

export default async function scopes(req, res) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);

    default:
      return res.status(405).json({
        error: {
          code: 405,
          message: "Method Not Allowed",
          suggestion: "Only GET are available from this API",
        },
      });
  }
}
