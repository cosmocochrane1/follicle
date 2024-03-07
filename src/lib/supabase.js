import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

// Create a client using supabase nextjs helper to retreive user session
export const supabaseClient = createPagesBrowserClient();

// Create a client
// export const supabaseClient = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
// )
