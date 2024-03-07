import OrganizationDetail from "@/components/Organizations/OrganizationDetail";
import OrganizationInviteMemberForm from "@/components/Organizations/OrganizationInviteMemberForm";
import OrganizationMemberList from "@/components/Organizations/OrganizationMemberList";
import PrimaryLayout from "@/components/PrimaryLayout";
import SettingPageSideMenu from "@/components/SettingPageSideMenu";
import { useCurrentOrganization } from "@/lib/hooks/useCurrentOrganization";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

const TeamPage = () => {
  const { isLoading: isLoadingCurrentUser } = useCurrentUser();
  const { isLoading: isLoadingCurrentOrganization } = useCurrentOrganization();

  const isLoading = isLoadingCurrentUser || isLoadingCurrentOrganization;

  return (
    <>
      <PrimaryLayout sidebar={<SettingPageSideMenu />}>
        {!isLoading && <OrganizationDetail />}
        <div className="py-6 border-b border-muted">
          <p className="font-medium mb-1">Team management</p>
          <p className="text-sm text-muted-foreground">
            Manage your team members and their account permissions here.
          </p>
        </div>
        <OrganizationInviteMemberForm />

        <OrganizationMemberList />
      </PrimaryLayout>
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  const supabase = createPagesServerClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };

  return {
    props: {},
  };
};

export default TeamPage;
