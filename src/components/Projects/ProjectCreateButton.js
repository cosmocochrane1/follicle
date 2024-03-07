import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import useUploadDocument from "@/lib/hooks/actions/useUploadDocument";
import { useToast } from "../ui/use-toast";
import LucideIcon from "../LucideIcon";
import { ProjectCreateDialog } from "./ProjectCreateDialog";

export const ProjectCreateButton = () => {
  const { toast } = useToast()
  const [projectCreateDialogOpen, setProjectCreateDialogOpen] = useState(false);

  return (
    <>
      <Button className="w-full flex items-center justify-start" onClick={() => {
        setProjectCreateDialogOpen(true);
      }}>
        <LucideIcon name='folder-plus' className="h-5 w-5 mr-2"/> Create Project
      </Button>
      <ProjectCreateDialog onOpenChange={setProjectCreateDialogOpen} open={projectCreateDialogOpen} onCallback={() => {
        setProjectCreateDialogOpen(false);
      }} />
    </>
  );
};

