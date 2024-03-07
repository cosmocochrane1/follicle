import LucideIcon from "@/components/LucideIcon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import useDeleteProject from "@/lib/hooks/actions/useDeleteProject";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function ProjectDeleteDialog({
  project,
  onOpenChange,
  open,
  onCallback,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const project_id = searchParams.get("project_id");
  const { deleteProject, isLoading, error } = useDeleteProject();
  // Create a new project, then navigate to the project's URL location
  // Submit handler for the form
  const deleteExistingProject = async () => {
    const response = await deleteProject(project.id);

    onCallback && onCallback();
    onOpenChange && onOpenChange();

    if (project_id === project.id) {
      router.replace("/projects");
    }
  };

  // we useEffect for error handling
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem deleting your project.",
      });
    }
  }, [error]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-destructive">
        <DialogHeader>
          <DialogTitle className="text-destructive">
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription className="text-destructive">
            This action cannot be undone. This will permanently delete the
            project {project?.name} and remove its data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogTrigger>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <DialogTrigger>
            <Button
              variant="destructive"
              onClick={() => {
                deleteExistingProject();
              }}
            >
              {isLoading && (
                <LucideIcon
                  name="loader-2"
                  className=" h-5 w-5 animate-spin mr-2"
                />
              )}
              DELETE
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
