import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import LucideIcon from "../../LucideIcon";
import { ProjectDeleteDialog } from "./ProjectDeleteDialog";
import { ProjectShareDialog } from "../ProjectShareDialog";
import { ProjectUpdateDialog } from "../ProjectUpdateDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ProjectActionMenu({ project, accessLevel }) {
  const [shareDialog, setShareDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  asChild
                  className="flex items-center-justify-center"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="bg-background/20"
                  >
                    <LucideIcon name="more-vertical" className="" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Project menu</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setShareDialog(true)}
            className="cursor-pointer"
          >
            Share
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setEditDialog(true)}
            className="cursor-pointer"
          >
            Edit
          </DropdownMenuItem>
          {accessLevel === "admin" && (
            <DropdownMenuItem
              onClick={() => setDeleteDialog(true)}
              className="cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ProjectDeleteDialog
        project={project}
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
      />
      <ProjectShareDialog
        project={project}
        open={shareDialog}
        onOpenChange={setShareDialog}
      />
      <ProjectUpdateDialog
        project={project}
        open={editDialog}
        onOpenChange={setEditDialog}
        onCallback={setEditDialog}
      />
    </>
  );
}
