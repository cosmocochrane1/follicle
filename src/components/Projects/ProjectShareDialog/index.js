import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProjectInviteUserForm } from "./ProjectInviteUserForm"

export function ProjectShareDialog({ project, onOpenChange, open }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
          <DialogDescription>Invite users to collaborate on {project.name}.</DialogDescription>
        </DialogHeader>
        <ProjectInviteUserForm project={project} />
      </DialogContent>
  </Dialog>
  )
}
