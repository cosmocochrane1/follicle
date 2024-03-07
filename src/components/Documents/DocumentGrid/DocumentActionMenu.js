import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { DocumentDeleteDialog } from "./DocumentDeleteDialog";
import { DocumentShareDialog } from "../DocumentShareDialog";
import { DocumentEditDialog } from "../DocumentEditDialog";
import LucideIcon from "../../LucideIcon";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DocumentActionMenu({ document, accessLevel }) {
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
                  <Button type="button" variant="ghost" size="icon">
                    <LucideIcon name="more-vertical" className="" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Document menu</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuItem onClick={() => setShareDialog(true)} className="cursor-pointer">
            Share
          </DropdownMenuItem> */}
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
      <DocumentDeleteDialog
        document={document}
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
      />
      {/* <DocumentShareDialog
        document={document}
        open={shareDialog}
        onOpenChange={setShareDialog}
      /> */}
      <DocumentEditDialog
        document={document}
        open={editDialog}
        onOpenChange={setEditDialog}
        onCallback={setEditDialog}
      />
    </>
  );
}
