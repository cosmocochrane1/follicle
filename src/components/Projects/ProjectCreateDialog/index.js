import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectCreateForm } from "./ProjectCreateForm";

export function ProjectCreateDialog({ onOpenChange, open, onCallback }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Create a new project to start organizaing your documents.
          </DialogDescription>
        </DialogHeader>
        <ProjectCreateForm
          onCallback={onCallback}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}
