import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

async function GET(req, res) {
  // Create authenticated Supabase Client
  const { user, supabase, organization, error } =
    await serverGetUserFromSupabaseAuth(req, res);
  const { search } = req.query;

  try {
    // Build the query dynamically based on conditions
    let query = supabase.from("profile_organizations").select(`
      *,  
      organization:organizations(
        *,
        profiles(
          *,
          scope:profile_organizations(*)
        )
      )
    `);

    // only return organizations
    query = query.eq("profile_id", user.id);

    if (search !== undefined) {
      query = query.ilike("name", `%${search}%`);
    }

    // Execute the query
    const { data, error } = await query;

    if (error) {
      console.error("Supabase error organizations:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    const organizations = data.map((org) => org.organization);

    // Filter organizations by user access
    const filteredData = organizations.map((org) => {
      return {
        ...org,
        profiles: org.profiles.map((profile) => {
          return {
            ...profile,
            scope: profile.scope.find((s) => {
              return (
                s.profile_id === profile.id && s.organization_id === org.id
              );
            }),
          };
        }),
      };
    });

    res.status(200).json(filteredData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function POST(req, res) {
  // Create authenticated Supabase Client and get session
  const { user, supabase, organization } = await serverGetUserFromSupabaseAuth(
    req,
    res
  );

  const { name, description } = req.body;

  const { data: newOrganization, error } = await supabase
    .from("organizations")
    .insert({
      name,
      description,
      owner_id: user.id,
    })
    .select()
    .single();
  if (error) {
    return res.status(500).json({ error });
  }

  res.status(201).json({
    message: "Added to organizations",
    status: "success",
    organization: newOrganization,
  });
}

// Define the PUT function
async function PUT(req, res) {
  const { user, supabase, organization } = await serverGetUserFromSupabaseAuth(
    req,
    res
  );

  const { id, name, thumbnail_url, description } = req.body;

  // Update the organization in the database
  const { data: updatedOrganization, error } = await supabase
    .from("organizations")
    .update({
      name,
      thumbnail_url,
      description,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error });
  }

  res.status(200).json({
    message: "Organization updated successfully",
    status: "success",
    organization: updatedOrganization,
  });
}

// Add the PUT method to your existing organizations function
export default async function organizations(req, res) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);
    case "POST":
      return await POST(req, res);
    case "PUT":
      return await PUT(req, res);
    default:
      return res.status(405).json({
        error: {
          code: 405,
          message: "Method Not Allowed",
          suggestion: "Only GET, POST, and PUT are available from this API",
        },
      });
  }
}
