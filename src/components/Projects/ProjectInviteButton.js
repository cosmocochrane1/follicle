// pages/index.js
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProjectShareDialog } from "./ProjectShareDialog";
import LucideIcon from "../LucideIcon.js";

export default function ProjectInviteButton({ project }) {
  const [projectInviteDialog, setProjectInviteDialog] = useState(false);

  return (
    <>
      <Button
        className="w-full flex items-center justify-center"
        // variant="outline"
        onClick={() => {
          setProjectInviteDialog(true);
        }}
      >
        <LucideIcon name="link" className="h-4 w-4 mr-2" />
        Share
      </Button>
      {project && (
        <ProjectShareDialog
          project={project}
          open={projectInviteDialog}
          onOpenChange={setProjectInviteDialog}
        />
      )}
    </>
  );
}
