import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useDocument } from "@/lib/hooks/useDocument";
import useUpdateDocumentName from "@/lib/hooks/actions/useUpdateDocumentName";
import { debounce } from "@/lib/utils";
import LucideIcon from "../LucideIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DocumentNameEditor({ canEdit = true }) {
  const { document, isLoading } = useDocument();
  // const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentName, setCurrentName] = useState("");
  const { updateDocumentName, isLoading: isDocumentNameLoading } =
    useUpdateDocumentName();

  useEffect(() => {
    setCurrentName(document?.name || "Untitled");
  }, [document]);

  const handleNameChange = (e) => {
    setCurrentName(e.currentTarget.value);
  };

  const debouncedUpdateDocumentName = debounce(async () => {
    if (isDocumentNameLoading) return;
    await updateDocumentName({
      name: currentName,
      documentId: document.id,
    });
  }, 500); // 500ms debounce
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className="flex items-center-justify-center">
          <form
            className="relative flex items-center justify-center"
            onSubmit={(e) => {
              e.preventDefault();
              debouncedUpdateDocumentName();
              setIsEditing(false);
            }}
          >
            {(isLoading || isDocumentNameLoading) && (
              <LucideIcon
                name="loader-2"
                className="absolute -left-1 top-2 mt-1 h-4 w-4 animate-spin"
              />
            )}
            {isEditing ? (
              <input
                value={currentName}
                style={{
                  width:
                    Math.min(Math.max(currentName.length, 2) + 5, 50) + "ch",
                }}
                className="text-md font-normal bg-transparent border-none outline-none px-4 w-full max-w-[calc(100vw-280px)]"
                onChange={handleNameChange}
                onBlur={() => {
                  debouncedUpdateDocumentName();
                  setIsEditing(false);
                }}
                autoFocus
              />
            ) : !canEdit ? (
              <p
                variant="link"
                type="button"
                disabled={true}
                className="text-md font-normal max-w-[calc(100vw-280px)] px-4"
                title={document?.name || "Untitled"}
              >
                <span className="whitespace-nowrap overflow-hidden text-ellipsis text-foreground">
                  {currentName}
                </span>
              </p>
            ) : (
              <Button
                variant="link"
                type="button"
                className="text-md font-normal max-w-[calc(100vw-280px)]"
                onClick={() => setIsEditing(true)}
                title={document?.name || "Untitled"}
              >
                <span className="whitespace-nowrap overflow-hidden text-ellipsis text-foreground">
                  {currentName}
                </span>
                <div className="ml-2 text-md w-4 h-4">
                  <LucideIcon
                    name="pen"
                    size={14}
                    className="stroke-foreground"
                  />
                </div>
              </Button>
            )}
          </form>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Edit name</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
