import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

async function GET(req, res) {
  // Create authenticated Supabase Client
  const { user, supabase, organization, error } =
    await serverGetUserFromSupabaseAuth(req, res);
  const { search, filter } = req.query;

  try {
    // Build the query dynamically based on conditions
    let query = supabase.from("projects").select(`
      *,
      profiles(
        *,
        scope:profile_projects(*)
      ),
      organization:organizations(
        *,
        profiles(
          *,
          scope:profile_organizations(*)
        )
      )
    `);

    if (organization) {
      query = query.filter("organization_id", "eq", organization.id);
    }

    if (search !== undefined) {
      query = query.ilike("name", `%${search}%`);
    }

    // Execute the query
    const { data, error } = await query;

    if (error) {
      console.error("Supabase error projects:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    // Filter projects by user access
    const filteredData = data.map((proj) => {
      return {
        ...proj,
        profiles: proj.profiles.map((profile) => {
          return {
            ...profile,
            scope: profile.scope.find((s) => {
              return s.profile_id === profile.id && s.project_id === proj.id;
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

  const { data: newProject, error } = await supabase
    .from("projects")
    .insert({
      name,
      description,
      organization_id: organization.id,
      created_by: user.id,
    })
    .select()
    .single();
  if (error) {
    return res.status(500).json({ error });
  }

  res.status(201).json({
    message: "Added to projects",
    status: "success",
    project: newProject,
  });
}

// Define the PUT function
async function PUT(req, res) {
  const { user, supabase, organization } = await serverGetUserFromSupabaseAuth(
    req,
    res
  );

  const { id, name, description } = req.body;

  // Update the project in the database
  const { data: updatedProject, error } = await supabase
    .from("projects")
    .update({
      name,
      description,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("organization_id", organization.id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error });
  }

  res.status(200).json({
    message: "Project updated successfully",
    status: "success",
    project: updatedProject,
  });
}

// Add the PUT method to your existing projects function
export default async function projects(req, res) {
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
