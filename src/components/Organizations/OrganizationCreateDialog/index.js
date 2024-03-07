import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrganizationCreateForm } from "./OrganizationCreateForm";

export function OrganizationCreateDialog({ onOpenChange, open, onCallback }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>
            Create a new team to start organizaing your documents.
          </DialogDescription>
        </DialogHeader>
        <OrganizationCreateForm
          onCallback={onCallback}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}
