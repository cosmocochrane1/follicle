import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DocumentInviteUserForm } from "./DocumentInviteUserForm"

export function DocumentShareDialog({ document, onOpenChange, open }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>Invite users to collaborate on {document.name}.</DialogDescription>
        </DialogHeader>
        <DocumentInviteUserForm document={document} />
      </DialogContent>
  </Dialog>
  )
}
