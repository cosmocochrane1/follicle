import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

async function GET(req, res) {
  // Create authenticated Supabase Client
  const supabase = createPagesServerClient({ req, res });
  const { specialties, location } = req.query;

  try {
    // Build the query dynamically based on conditions
    let supabaseQuery = supabase.from("doctors").select(`*`);

    if (specialties !== undefined) {
      supabaseQuery = supabaseQuery.contains("specialty", [`%${specialties}%`]);
    }

    if (location !== undefined) {
      supabaseQuery = supabaseQuery.ilike("location", `%${location}%`);
    }

    // Execute the supabaseQuery
    const { data, error } = await supabaseQuery;

    if (error) {
      console.error("Supabase error doctors:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Add the PUT method to your existing doctors function
export default async function doctors(req, res) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);
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
