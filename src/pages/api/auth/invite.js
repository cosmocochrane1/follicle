import { sendEmail } from "@/lib/email";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { serverGetUserFromSupabaseAuth } from "@/lib/serverGetUserFromSupabaseAuth";
import { OrganizationInvitationEmail } from "emails/OrganizationInvitationEmail";
import { render } from "jsx-email";

async function POST(req, res) {
  // Create authenticated Supabase Client and get session
  const { organization } = await serverGetUserFromSupabaseAuth(req, res);
  const { email } = req.body;

  if (!email) {
    return res.status(403).json({
      error: {
        code: 403,
        message: "Email required",
        suggestion: "Please submit an email address to invite",
      },
    });
  }

  // Initial invite (this will create user on supabase)
  let { data: invitation, error: errorInvite } =
    await supabaseAdmin.auth.admin.generateLink({
      type: "invite",
      email: email,
      options: {
        redirectTo: `${process.env.SITE_URL}/invite?organization=${organization.id}`,
      },
    });

  // If profile exists, return the existing profile
  const { data: profile, error: errorProfile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();

  // If profile organization is already created, return already invited error
  const { data: profileOrganization, error: errorProfileOrganization } =
    await supabaseAdmin
      .from("organization_profiles")
      .select("*")
      .eq("profile_id", profile?.id)
      .eq("organization_id", organization.id)
      .single();

  if (profileOrganization) {
    return res.status(422).json({
      message: "User already invited.",
      status: "error",
    });
  }

  if (errorInvite) {
    // Second invite (this will send invite if the first invitation failed or expired)
    const { data: magicLinkInvitation, error: errorInvite } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: email,
        options: {
          redirectTo: `${process.env.SITE_URL}/invite?organization=${organization.id}`,
        },
      });

    invitation = magicLinkInvitation;
  }

  if (errorProfile) {
    return res.status(500).json({ error: errorProfile });
  }

  await sendEmail({
    to: email,
    subject: `You've been invited to join ${organization.name} on Ijin`,
    html: await render(
      <OrganizationInvitationEmail
        invitationLink={invitation.properties.action_link}
        organization={organization}
      />,
    ),
  });

  return res.status(200).json(profile);
}

export default async function inviteUser(req, res) {
  switch (req.method) {
    case "POST":
      return await POST(req, res);

    default:
      return res.status(405).json({
        error: {
          code: 405,
          message: "Method Not Allowed",
          suggestion: "Only POST is available from this API",
        },
      });
  }
}
