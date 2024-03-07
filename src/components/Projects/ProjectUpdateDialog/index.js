import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProjectUpdateForm } from "./ProjectUpdateForm"


export function ProjectUpdateDialog({ onOpenChange, open, project, onCallback }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Project</DialogTitle>
          <DialogDescription>Update the project {project.name}. Members will be notified.</DialogDescription>
        </DialogHeader>
        <ProjectUpdateForm onCallback={onCallback} onOpenChange={onOpenChange} project={project}  />
      </DialogContent>
    </Dialog>
  )
}
