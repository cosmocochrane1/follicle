import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import useRemoveProfileFromProject from "@/lib/hooks/actions/useRemoveProfileFromProject";
import { useSearchParams } from "next/navigation";
import LucideIcon from "../../LucideIcon";

export function ProjectRemoveUserDialog({ user, onOpenChange, open }) {
  const { removeProfileFromProject, isLoading } = useRemoveProfileFromProject();
  const searchParams = useSearchParams();
  const project_id = searchParams.get("project_id");
  // Create a new user, then navigate to the user's URL location
  async function removeExistingUser() {
    await removeProfileFromProject({
      profile_id: user.id,
      project_id,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-destructive">
        <DialogHeader>
          <DialogTitle className="text-destructive">Are you sure?</DialogTitle>
          <DialogDescription className="text-destructive">
            This will remove {user?.email}'s access to the project.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogTrigger><Button variant="outline">Cancel</Button></DialogTrigger>
          <DialogTrigger>
            <Button 
              disabled={isLoading} 
              type="button" 
              variant="destructive"
              onClick={() => {
                removeExistingUser();
              }}
            > 
              {isLoading && <LucideIcon name="loader-2" className="mr-1 h-4 w-4 animate-spin" />} Remove
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
