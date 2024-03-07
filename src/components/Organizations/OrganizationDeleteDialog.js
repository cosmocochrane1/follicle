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
import useDeleteOrganization from "@/lib/hooks/actions/useDeleteOrganization";
import { useCurrentOrganization } from "@/lib/hooks/useCurrentOrganization";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function OrganizationDeleteDialog({
  organization,
  onOpenChange,
  open,
  onCallback,
}) {
  const { deleteOrganization, isLoading, error } = useDeleteOrganization();
  const { currentUser } = useCurrentUser();
  const { setSelectedOrgId } = useCurrentOrganization();
  // Create a new organization, then navigate to the organization's URL location
  // Submit handler for the form
  const deleteExistingOrganization = async () => {
    const response = await deleteOrganization(organization.id);

    onCallback && onCallback();
    onOpenChange && onOpenChange();

    setSelectedOrgId(currentUser.id);
  };

  // we useEffect for error handling
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem deleting your organization.",
      });
    }
  }, [error]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange(null);
      }}
    >
      <DialogContent className="border border-destructive">
        <DialogHeader>
          <DialogTitle className="text-destructive">
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription className="text-destructive">
            This action cannot be undone. This will permanently delete the
            organization {organization?.name} and remove its data from our
            servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogTrigger>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <Button
            variant="destructive"
            onClick={() => {
              deleteExistingOrganization();
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
