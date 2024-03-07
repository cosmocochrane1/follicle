import { Button } from "../ui/button";
import { useEffect, useRef } from "react";
import useUploadDocument from "@/lib/hooks/actions/useUploadDocument";
import { useToast } from "../ui/use-toast";
import LucideIcon from "../LucideIcon";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DocumentUploadLoading } from "./DocumentUploadLoading";

export const DocumentUploadIconButton = () => {
  const { toast } = useToast();
  const { uploadDocument, isLoading, error } = useUploadDocument();
  const inputFileRef = useRef(null);

  const handleButtonClick = () => {
    inputFileRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== "application/pdf") return;
    uploadDocument(file);
  };

  // we useEffect for error handling
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  }, [error]);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild className="flex items-center-justify-center">
            <div>
              <input
                type="file"
                ref={inputFileRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="application/pdf"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleButtonClick}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LucideIcon
                    name="loader-2"
                    className=" h-5 w-5 animate-spin"
                  />
                ) : (
                  <LucideIcon name="upload-cloud" className="h-5 w-5 " />
                )}
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Upload file</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DocumentUploadLoading open={isLoading} />
    </>
  );
};
