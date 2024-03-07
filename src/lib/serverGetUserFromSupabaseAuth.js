import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export async function serverGetUserFromSupabaseAuth(req, res) {
  const supabase = createPagesServerClient({ req, res });

  const { data: session } = await supabase.auth.getSession();

  if (!session) {
    return { error: "Unauthorised" };
  }

  const authUser = session.user || session.session.user;

  if (!authUser) {
    return { error: "No user found?" };
  }

  const { data: user, error } = await supabase
    .from("profiles")
    .select(
      `
      *,
      organizations(
        *,
        profiles(
          *,
          scope:profile_organizations(*)
        )
      )
    `,
    )
    .eq("id", authUser.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return { error: "Internal Server Error" };
  }

  if (!user) {
    return { error: "No user found" };
  }

  // Select the organization specified by the query parameter or default to the first one.
  let selectedOrganization = null;
  const { organization_id } = req.query;

  if (organization_id) {
    selectedOrganization = user.organizations.find(
      (org) => org.id === organization_id,
    );
  }

  if (
    !selectedOrganization &&
    user.organizations &&
    user.organizations.length > 0
  ) {
    selectedOrganization =
      user.organizations.find((org) => org.id === user.id) ||
      user.organizations[0]; // Default to the first organization
  }

  const updatedOrganization = {
    ...selectedOrganization,
    profiles: selectedOrganization.profiles.map((profile) => {
      return {
        ...profile,
        scope: profile.scope.find((s) => {
          return (
            s.profile_id === profile.id &&
            s.organization_id === selectedOrganization.id
          );
        }),
      };
    }),
  };

  user.scope = updatedOrganization.profiles.find(
    (profile) => profile.id === user.id,
  ).scope;
  user.scope_access = user?.scope?.scope_access || null;

  return {
    user,
    session,
    supabase,
    organization: updatedOrganization,
    error: null,
  };
}
