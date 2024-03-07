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
import useDeleteDocument from "@/lib/hooks/actions/useDeleteDocument";
import { useEffect } from "react";

export function DocumentDeleteDialog({
  document,
  onOpenChange,
  open,
  onCallback,
}) {
  const { deleteDocument, isLoading, error } = useDeleteDocument();

  // Submit handler for the form
  const deleteExistingDocument = async () => {
    const response = await deleteDocument(document.id);

    onCallback && onCallback();
    onOpenChange && onOpenChange();
  };

  // we useEffect for error handling
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem deleting your document.",
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
            project {document.name} and remove its data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogTrigger>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <Button
            variant="destructive"
            onClick={() => {
              deleteExistingDocument();
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
