
import FullPageLoading from "@/components/FullPageLoading";
import TopBar from "@/components/TopBar";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

const AccountPage = () => {
  return (
    <>
      <FullPageLoading />
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  return {
    redirect: {
      destination: "/settings/account",
      permanent: true,
    },
  };
};

export default AccountPage;
