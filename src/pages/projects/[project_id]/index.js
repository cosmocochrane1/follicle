import { BackButton } from "@/components/BackButton";
import Chat from "@/components/Chat";
import DocumentGrid from "@/components/Documents/DocumentGrid";
import { GenericAvatar } from "@/components/GenericAvatar";
import LucideIcon from "@/components/LucideIcon";
import PrimaryLayout from "@/components/PrimaryLayout";
import { ProjectSettingsButton } from "@/components/Projects/ProjectSettingsButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { hasProjectAccess } from "@/lib/access";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useProjects } from "@/lib/hooks/useProjects";
import { TabsList, Tabs, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
// import { GlobalSearch } from '@/components/GlobalSearch';

export default function Project({}) {
  const searchParams = useSearchParams();
  const { currentUser } = useCurrentUser();
  const project_id = searchParams.get("project_id");
  const { projects, isLoading } = useProjects();
  const project = projects?.find((project) => project.id === project_id);
  const accessLevel =
    project && currentUser && hasProjectAccess(project, currentUser?.id);

  return (
    <>
      <PrimaryLayout
        className={"bg-card"}
        sidebar={
          <div className="flex">
            {isLoading && (
              <div className="px-4 py-2 flex w-full h-full">
                <Skeleton className="h-10 w-full rounded-lg bg-foreground/5 mb-3" />
              </div>
            )}
            {project && !isLoading && (
              <div className="flex justify-between items-center pt-2 px-4 w-full">
                <BackButton />
                <p className="truncate">{project?.name}</p>
                <ProjectSettingsButton
                  project={project}
                  accessLevel={accessLevel || "read"}
                />
              </div>
            )}
            <Chat />
          </div>
        }
      >
        <DocumentGrid accessLevel={accessLevel} />
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
