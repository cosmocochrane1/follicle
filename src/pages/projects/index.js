import OrganizationList from "@/components/Organizations/OrganizationList";
import PrimaryLayout from "@/components/PrimaryLayout";
import ProjectFilters from "@/components/Projects/ProjectFilters";
import ProjectGrid from "@/components/Projects/ProjectGrid";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default function Home({}) {
  return (
    <>
      <PrimaryLayout sidebar={<OrganizationList />}>
        <ProjectFilters />
        <div className="h-4" />
        <ProjectGrid />
      </PrimaryLayout>
    </>
  );
}

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
