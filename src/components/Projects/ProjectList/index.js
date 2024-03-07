import qs from "query-string";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/lib/hooks/useProjects";
import { ProjectCreateDialog } from "../ProjectCreateDialog";
import LucideIcon from "../../LucideIcon";
import { GenericAvatar } from "@/components/GenericAvatar";

export default function ProjectList() {
  const [projectCreateDialogOpen, setProjectCreateDialogOpen] = useState(false);
  const { projects, isLoading } = useProjects();
  const router = useRouter();
  const searchParams = useSearchParams();
  const project_id = searchParams.get("project_id");

  const [selected, setSelected] = useState(project_id);

  const onClick = (typeId) => {
    setSelected(typeId);
    const query = { project_id: typeId };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  useEffect(() => {
    setSelected(project_id);
  }, [project_id]);

  return (
    <>
      <details className="">
        <summary
          onClick={() => {
            onClick();
          }}
          className={`
            ${!selected && "bg-foreground/10 hover:bg-foreground/20"}
            flex items-center justify-between py-3 px-6 cursor-pointer stroke-primary hover:bg-foreground/10
          `}
        >
          <div className="flex flex-1 w-full items-start justify-start space-x-3 pl-0">
            <LucideIcon name="clock" className="h-5 w-5" />
            <span className="text-sm capitalize">Recent</span>
          </div>
        </summary>
      </details>
      <h4 className="px-6 py-3 pb-2 border-b border-foreground/10 text-sm font-medium">
        Projects
      </h4>
      {isLoading &&
        [...Array(2)].map((_, i) => {
          return (
            // <summary className="px-0 pb-2" key={i}>
            //   <Skeleton className="h-8 w-full rounded-none bg-foreground/10" />
            // </summary>
            <div
              className="flex w-full items-center justify-center px-6 py-3"
              key={i}
            >
              <Skeleton className="h-5 w-5 rounded-lg bg-foreground/10 pl-0 pr-6" />
              <div className="w-full pl-3 flex flex-col items-start justify-center space-y-1">
                {/* <Skeleton  className="h-6 w-full rounded-full bg-foreground/10" /> */}
                <Skeleton className="h-5 w-full rounded-lg bg-foreground/10" />
              </div>
            </div>
          );
        })}
      {!isLoading &&
        projects &&
        projects.length > 0 &&
        projects.map((project) => {
          const isSelected = selected && selected == project.id;
          return (
            <details key={project.id}>
              <summary
                onClick={() => {
                  onClick(project.id);
                }}
                className={`
                  ${isSelected && "bg-foreground/10 hover:bg-foreground/20"}
                  flex items-center justify-between py-3 px-6 cursor-pointer stroke-primary hover:bg-foreground/10
                `}
              >
                <div className="flex flex-1 w-full items-start justify-start space-x-3 pl-0">
                  <GenericAvatar
                    src={project.thumbnail_url}
                    name={project.name}
                    className="h-5 w-5"
                  />
                  <span className="text-sm capitalize">{project.name}</span>
                </div>
              </summary>
            </details>
          );
        })}
      <div className="p-3">
        <Button
          variant="outline"
          className="w-full flex items-center justify-start"
          onClick={() => {
            setProjectCreateDialogOpen(true);
          }}
        >
          <LucideIcon name="folder-plus" className="h-5 w-5 mr-2" /> Create
          Project
        </Button>
      </div>
      <ProjectCreateDialog
        onOpenChange={setProjectCreateDialogOpen}
        open={projectCreateDialogOpen}
        onCallback={() => {
          setProjectCreateDialogOpen(false);
        }}
      />
    </>
  );
}
