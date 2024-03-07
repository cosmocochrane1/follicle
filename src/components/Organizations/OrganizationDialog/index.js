import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TeamInviteUserForm } from "./TeamInviteUserForm"

export function OrganizationDialog({ onOpenChange, open }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Team</DialogTitle>
          <DialogDescription>Manage your team members.</DialogDescription>
        </DialogHeader>
        <TeamInviteUserForm />
      </DialogContent>
  </Dialog>
  )
}
