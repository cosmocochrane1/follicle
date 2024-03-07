import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";

async function GET(req, res) {
  // Create authenticated Supabase Client and get session
  const { organization } = await serverGetUserFromSupabaseAuth(req, res);
  res.status(200).json(organization);
}

async function PUT(req, res) {
  const { organization, supabase } = await serverGetUserFromSupabaseAuth(
    req,
    res,
  );

  // If there is no organization, return an error
  if (!organization) {
    return res
      .status(403)
      .json({ error: "No organization found in the user's session" });
  }

  // Update the organization
  const { data: updatedOrganization, error: updateError } = await supabase
    .from("organizations")
    .update(req.body)
    .eq("id", organization.id)
    .single();

  // If there is an error, return it
  if (updateError) {
    return res.status(500).json({ error: updateError });
  }

  // Return the updated organization
  return res.status(200).json(updatedOrganization);
}

export default async function currentOrganization(req, res) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);
    case "PUT":
      return await PUT(req, res);

    default:
      return res.status(405).json({
        error: {
          code: 405,
          message: "Method Not Allowed",
          suggestion: "Only GET and PUT is available from this API",
        },
      });
  }
}
