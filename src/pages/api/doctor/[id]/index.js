import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

async function GET(req, res) {
  const { id } = req.query;
  console.log("whats going wrong");
  console.log("id");
  console.log(id);
  if (!id) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Bad Request",
        suggestion: "id is required",
      },
    });
  }

  const supabase = createPagesServerClient({ req, res });

  const { data: doctor, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(500).json({ error });
  }

  if (!doctor) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Doctor Not Found",
        suggestion: `No Doctor found for authenticated user.`,
      },
    });
  }

  res.status(200).json(doctor);
}

// Add the PUT method to your existing doctors$ function
export default async function doctors$(req, res) {
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
