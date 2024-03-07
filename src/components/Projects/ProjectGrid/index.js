import Link from "next/link";
import qs from "query-string";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getTimeFromNow } from "@/lib/utils";
import { GenericAvatar } from "@/components/GenericAvatar";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { hasDocumentAccess, hasProjectAccess } from "@/lib/access";
import LucideIcon from "../../LucideIcon";
import { useProjects } from "@/lib/hooks/useProjects";
import { ProjectActionMenu } from "./ProjectActionMenu";
import { EmptyStateCard } from "@/components/EmptyStateCard";
import { ProjectCreateButton } from "../ProjectCreateButton";
import { useMemo } from "react";

export default function ProjectGrid({ group, className, ...props }) {
  const { currentUser } = useCurrentUser();
  // const { documents, isLoading } = useDocuments();
  const { projects, isLoading } = useProjects();

  const showProjects = useMemo(() => {
    return !isLoading && projects && currentUser && Array.isArray(projects);
  }, [isLoading, projects, currentUser]);

  const showEmptyState = useMemo(() => {
    return !isLoading && (!projects || projects.length === 0);
  }, [isLoading, projects]);

  return (
    <>
      <ul className="grid grid-cols-3 gap-4 gap-y-8 w-full pb-16">
        {isLoading &&
          [...Array(6)].map((_, i) => (
            <div
              className="flex flex-col items-center justify-center p-0"
              key={i}
            >
              <Skeleton className="h-56 w-full rounded-lg bg-card/70 mb-3" />
            </div>
          ))}
        {showProjects &&
          [...projects].reverse().map((project) => {
            const accessLevel = hasProjectAccess(project, currentUser?.id);
            return (
              <li
                key={project.id}
                className="relative flex flex-col  overflow-hidden items-center justify-between bg-card hover:bg-card/70 border rounded-lg"
              >
                <Link
                  href={`/projects/${project.id}`}
                  className="flex flex-col items-center w-full"
                >
                  <>
                    {project.thumbnail_url ? (
                      <div className="relative h-56 rounded-t-lg ">
                        {/* <img
                          src={project.thumbnail_url}
                          alt={`Thumbnail for ${project.name}`}
                          className="object-cover h-40 w-32 rounded-lg py-3"
                        /> */}
                        <img
                          src={project.thumbnail_url}
                          alt={`Thumbnail for ${project.name}`}
                          className="object-cover h-full w-full "
                        />
                      </div>
                    ) : (
                      <div className="items-center justify-center flex h-56 w-32 rounded-lg p-4">
                        <LucideIcon name="file" className="w-32 h-32" />
                      </div>
                    )}
                    <div className="flex items-center justify-between relative space-x-2 w-full border-t p-4">
                      <div className="w-3/5 text-start">
                        <h4 className="text-sm truncate">{project.name}</h4>
                        <p className="text-xs opacity-70">
                          Edited {getTimeFromNow(project.updated_at)}
                        </p>
                      </div>
                      <div className="flex flex-1 items-center justify-end relative space-x-2">
                        {project?.profiles?.length > 3 && (
                          <p className="text-sm mr-1">
                            +{project?.profiles?.length - 3}
                          </p>
                        )}
                        <div className="flex items-center relative z-0">
                          {project?.profiles
                            ?.slice(0, 3)
                            .map((profile, index) => (
                              <GenericAvatar
                                key={index}
                                src={profile?.avatar_url}
                                email={
                                  profile?.email || "fallback-" + Math.random()
                                }
                                className={`relative z-${3 - index} ${
                                  index > 0 ? "-ml-3" : ""
                                } border-4 border-background cursor-pointer`}
                              />
                            ))}
                        </div>
                      </div>
                    </div>
                  </>
                </Link>
                {(accessLevel == "admin" || accessLevel == "write") && (
                  <div className="absolute top-2 right-2">
                    <ProjectActionMenu
                      project={project}
                      accessLevel={accessLevel}
                    />
                  </div>
                )}
              </li>
            );
          })}
        <div
          className={`absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-background/70 backdrop-blur-[1px]   transition-all ${
            showEmptyState ? "duration-500" : "duration-300"
          } ease-in-out
          transform  ${
            showEmptyState ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <EmptyStateCard
            title="Start your first project"
            actions={[
              <div key="empty-state-upload-project">
                <ProjectCreateButton className="w-auto" />
              </div>,
            ]}
          >
            <p className="text-foreground/70 leading-relaxed">
              No projects yet? Let's lay the foundation! <br /> Start your first
              project to start collaborating with your team.
            </p>
          </EmptyStateCard>
        </div>
      </ul>
    </>
  );
}
