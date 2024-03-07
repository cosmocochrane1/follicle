import PrimaryLayout from "@/components/PrimaryLayout";
import ProfileDetailForm from "@/components/Profiles/ProfileDetailForm";
import ProfilePasswordForm from "@/components/Profiles/ProfilePasswordForm";
import SettingPageSideMenu from "@/components/SettingPageSideMenu";
import TopBar from "@/components/TopBar";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

const AccountPage = () => {
  return (
    <>
      <PrimaryLayout sidebar={<SettingPageSideMenu />}>
        <h2 className="text-3xl mb-5">My Account</h2>
        <ProfileDetailForm />

        <ProfilePasswordForm />
        <div className="flex items-center gap-x-3 px-6 justify-between font-medium pt-24" />
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

export default AccountPage;
