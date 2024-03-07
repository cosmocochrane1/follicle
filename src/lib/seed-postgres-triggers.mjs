import postgres from "postgres";
import "dotenv/config";

const dbUrl = process.env.SUPABASE_DATABASE_URL;

if (!dbUrl) {
  throw new Error("Couldn't find db url");
}
const sql = postgres(dbUrl);

async function main() {
  await sql`grant usage on schema public to postgres, anon, authenticated, service_role;`;
  await sql`grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;`;
  await sql`grant all privileges on all functions in schema public to postgres, anon, authenticated, service_role;`;
  await sql`grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;`;
  await sql`alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;`;
  await sql`alter default privileges in schema public grant all on functions to postgres, anon, authenticated, service_role;`;
  await sql`alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;`;
  await sql`grant all privileges on all tables in schema auth to postgres, service_role;`;
  await sql`grant all privileges on all functions in schema auth to postgres, service_role;`;
  await sql`grant all privileges on all sequences in schema auth to postgres, service_role;`;
  await sql`alter default privileges in schema auth grant all on tables to postgres, service_role;`;
  await sql`alter default privileges in schema auth grant all on functions to postgres, service_role;`;
  await sql`alter default privileges in schema auth grant all on sequences to postgres, service_role;`;

  console.log("✨  Finished granting privileges.");

  process.exit();
}

main();
