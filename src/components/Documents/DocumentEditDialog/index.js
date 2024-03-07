import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DocumentEditForm } from "./DocumentEditForm"


export function DocumentEditDialog({ onOpenChange, open, onCallback, document }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Document Name</DialogTitle>
          <DialogDescription>Update your document name here.</DialogDescription>
        </DialogHeader>
        <DocumentEditForm document={document} onCallback={onCallback} onOpenChange={onOpenChange}  />
      </DialogContent>
    </Dialog>
  )
}
