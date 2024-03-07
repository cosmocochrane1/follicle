import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProfileForm } from "./ProfileForm"

export function ProfileDialog({ onOpenChange, open }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>Update you profile details.</DialogDescription>
        </DialogHeader>
        <ProfileForm />
      </DialogContent>
  </Dialog>
  )
}
