import { Separator } from "./ui/separator";
import { ProfileMenu } from "./Profiles/ProfileMenu";
import { useProjects } from "@/lib/hooks/useProjects";
import { useSearchParams } from "next/navigation";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { hasOrganizationAccess, hasProjectAccess } from "@/lib/access";
import ProjectInviteButton from "./Projects/ProjectInviteButton";
import { DocumentUploadIconButton } from "./Documents/DocumentUploadIconButton";
import { GlobalSearch } from "./GlobalSearch";
import Image from "next/image";
import Link from "next/link";
import { ProjectCreateButton } from "./Projects/ProjectCreateButton";
import { BackButton } from "./BackButton";
import { useMemo } from "react";
import { useDocument } from "@/lib/hooks/useDocument";
import { useOrganizations } from "@/lib/hooks/useOrganizations";
import { useCurrentOrganization } from "@/lib/hooks/useCurrentOrganization";

export default function TopBar({ goBack = false }) {
  const { document, isLoading: isDocumentLoading } = useDocument();
  const { currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();
  const { organizations, isLoading: isOrganizationsLoading } =
    useOrganizations();
  const { currentOrganization, setSelectedOrgId } = useCurrentOrganization();
  const { projects, isLoading: isLoadingProjects } = useProjects();
  const searchParams = useSearchParams();
  const project_id = searchParams.get("project_id");

  const organizationAccess = useMemo(
    () =>
      currentOrganization &&
      currentUser &&
      !isCurrentUserLoading &&
      !isOrganizationsLoading
        ? hasOrganizationAccess(currentOrganization, currentUser.id)
        : false,
    [
      organizations,
      currentOrganization,
      currentUser,
      isCurrentUserLoading,
      isDocumentLoading,
    ]
  );

  const canEditOrganization = useMemo(
    () => organizationAccess === "write" || organizationAccess === "admin",
    [organizationAccess]
  );

  const selectedProject = useMemo(
    () =>
      project_id &&
      projects?.find((projects) => `${projects.id}` === project_id),
    [project_id, projects]
  );

  const projectAccess = useMemo(
    () =>
      selectedProject &&
      currentUser &&
      !isCurrentUserLoading &&
      !isLoadingProjects
        ? hasProjectAccess(selectedProject, currentUser.id)
        : false,
    [selectedProject, currentUser, isCurrentUserLoading, isLoadingProjects]
  );

  const canEditProject = useMemo(
    () =>
      projectAccess === "write" ||
      projectAccess === "admin" ||
      canEditOrganization,
    [projectAccess, canEditOrganization]
  );

  const documentAccess = useMemo(
    () =>
      document && currentUser && !isCurrentUserLoading && !isDocumentLoading
        ? hasDocumentAccess(document, currentUser.id)
        : false,
    [document, currentUser, isCurrentUserLoading, isDocumentLoading]
  );

  const canEditDocument = useMemo(
    () =>
      documentAccess === "write" ||
      documentAccess === "admin" ||
      canEditOrganization ||
      canEditProject,
    [documentAccess, canEditOrganization, canEditProject]
  );

  return (
    <>
      <header className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between gap-x-4 bg-background text-foreground w-screen border-b">
        <section className="relative flex items-center justify-start space-x-3 h-full max-w-[325px] w-1/3 border-r px-6">
          {goBack && <BackButton />}
          {/* {!goBack && ( */}
          <Link href="/projects" className="relative w-[100px] h-[32px]">
            <Image
              className="invert dark:invert-0"
              src="/svgs/logo-white.svg"
              alt="Logo"
              fill
            />
          </Link>
          {/* )} */}
        </section>
        <section className="flex flex-1 flex-grow justify-between items-center w-full">
          <div className="w-full max-w-[525px]">
            {/* <OrganizationSelector /> */}
            <div>
              <GlobalSearch />
            </div>
          </div>
          <div className="flex space-x-4 items-center justify-between h-5 pr-4">
            <div className="flex justify-between items-center w-full pl-4 whitespace-nowrap">
              <div className="flex items-center justify-center space-x-2">
                {project_id && canEditProject && (
                  <DocumentUploadIconButton project={selectedProject} />
                )}
                {project_id && canEditProject && (
                  <ProjectInviteButton project={selectedProject} />
                )}
                {!project_id && canEditOrganization && <ProjectCreateButton />}
              </div>
            </div>
            {/* <LucideIcon name="help-circle"/> */}
            <Separator orientation="vertical" className="bg-border" />
            <ProfileMenu />
          </div>
        </section>
      </header>
    </>
  );
}
