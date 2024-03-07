import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
// import { ProjectDeleteDialog } from "./ProjectDeleteDialog"
// import { ProjectShareDialog } from "../ProjectShareDialog";
// import { ProjectEditDialog } from "../ProjectEditDialog";
import LucideIcon from "../LucideIcon";
import { ProjectDeleteDialog } from "./ProjectGrid/ProjectDeleteDialog";
import { ProjectUpdateDialog } from "./ProjectUpdateDialog";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ProjectSettingsButton({ project, accessLevel }) {
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={
              accessLevel === "read" ? "opacity-0 pointer-events-none" : ""
            }
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  asChild
                  className="flex items-center-justify-center"
                >
                  <Button type="button" variant="ghost" size="icon">
                    {/* <LucideIcon name="more-vertical" className="" /> */}
                    <LucideIcon name="settings" className="" size={18} />
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
      <ProjectUpdateDialog
        project={project}
        open={editDialog}
        onOpenChange={setEditDialog}
        onCallback={setEditDialog}
      />
    </>
  );
}
