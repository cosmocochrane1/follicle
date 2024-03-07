import { Separator } from "@/components/ui/separator";
import { ProfileMenu } from "@/components/Profiles/ProfileMenu";
import { useProjects } from "@/lib/hooks/useProjects";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import {
  hasDocumentAccess,
  hasOrganizationAccess,
  hasProjectAccess,
} from "@/lib/access";
import ProjectInviteButton from "@/components/Projects/ProjectInviteButton";
import { DocumentUploadIconButton } from "@/components/Documents/DocumentUploadIconButton";
import { GlobalSearch } from "@/components/GlobalSearch";
import Image from "next/image";
import Link from "next/link";
import { ProjectCreateButton } from "@/components/Projects/ProjectCreateButton";
import { BackButton } from "@/components/BackButton";
import { useDocument } from "@/lib/hooks/useDocument";
import DocumentNameEditor from "./DocumentNameEditor";
import { Skeleton } from "../ui/skeleton";
import Room from "../Room";
import DocumentLiveUsers from "./DocumentLiveUsers";

export default function DocumentTopBar({ goBack = true }) {
  const { document, isLoading: isDocumentLoading } = useDocument();
  const { currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();
  const { projects, isLoading: isLoadingProjects } = useProjects();
  const searchParams = useSearchParams();
  const project_id = searchParams.get("project_id");

  const documentAccess = useMemo(
    () =>
      document && currentUser && !isCurrentUserLoading && !isDocumentLoading
        ? hasDocumentAccess(document, currentUser.id)
        : false,
    [document, currentUser, isCurrentUserLoading, isDocumentLoading]
  );

  const canEditDocument = useMemo(
    () => documentAccess === "write" || documentAccess === "admin",
    [documentAccess]
  );

  const selectedProject = useMemo(
    () =>
      project_id &&
      projects?.find((projects) => `${projects.id}` === project_id),
    [project_id, projects]
  );

  const isLoading = useMemo(() => {
    return isCurrentUserLoading || isLoadingProjects || isDocumentLoading;
  }, [isCurrentUserLoading, isLoadingProjects, isDocumentLoading]);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between gap-x-4 bg-background text-foreground w-screen border-b">
        <section className="relative flex items-center justify-start space-x-3 h-full px-6">
          <BackButton href={`/projects/${project_id}`} />

          {document && !isLoading ? (
            <DocumentNameEditor canEdit={canEditDocument} />
          ) : (
            <>
              <div />
              <Skeleton className="w-36 h-8 pl-8" />
            </>
          )}
          {isDocumentLoading ? (
            <>
              <div />
              <Skeleton className="w-36 h-8 pl-8" />
            </>
          ) : (
            <Room
              fallback={
                <>
                  <div />
                  <Skeleton className="w-36 h-8 pl-8" />
                </>
              }
              roomId={document?.id || "fallback"}
            >
              {() => {
                return (
                  <>
                    <DocumentLiveUsers />
                  </>
                );
              }}
            </Room>
          )}
        </section>
        <section className="flex flex-1 flex-grow justify-end items-center w-full">
          <div className="flex space-x-4 items-center justify-between h-5 pr-4">
            <div className="flex justify-between items-center w-full pl-4 whitespace-nowrap">
              <div className="flex items-center justify-center space-x-2">
                {canEditDocument && (
                  <DocumentUploadIconButton project={selectedProject} />
                )}
                {canEditDocument && (
                  <ProjectInviteButton project={selectedProject} />
                )}
              </div>
            </div>
            {/* <LucideIcon name="help-circle"/> */}
            <Separator orientation="vertical" className="bg-border" />
            <ProfileMenu />
          </div>
        </section>
        <section className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mx-auto flex items-center h-16 justify-center space-x-3">
          <Link href="/projects" className="relative w-[100px] h-[32px]">
            <Image
              className="invert dark:invert-0"
              src="/svgs/logo-white.svg"
              alt="Logo"
              fill
            />
          </Link>
        </section>
      </header>
    </>
  );
}
