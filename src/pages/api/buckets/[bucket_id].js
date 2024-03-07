import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";

async function GET(req, res) {
  const bucketId = req.query.bucket_id;
  const path = req.query.path;

  if (!bucketId) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Bad Request",
        suggestion: "bucket_id is required",
      },
    });
  }

  if (!path) {
    return res.status(400).json({
      error: {
        code: 400,
        message: "Bad Request",
        suggestion: "?path=:path is required",
      },
    });
  }

  /** TODO
   * Ensure user || organization has permission to view document
   */
  const { supabase } = await serverGetUserFromSupabaseAuth(req, res);
  const { data, error } = await supabase.storage
    .from(bucketId)
    .createSignedUrl(path, 24 * 60 * 60); // valid SignedURL for 1 day

  if (error) {
    return res.status(500).json({ error });
  }

  res.status(200).json(data.signedUrl);
}

export default async function buckets(req, res) {
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
