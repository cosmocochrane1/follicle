import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useMemo } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { cn, debounce } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import LucideIcon from "../LucideIcon";
import { useDocuments } from "@/lib/hooks/useDocuments";
import { useRouter, useSearchParams } from "next/navigation";
import { useDocument } from "@/lib/hooks/useDocument";
import { useCamera } from "@/lib/hooks/useCamera";
import { useCanvasMode } from "@/lib/hooks/useCanvasMode";
import { modes } from "@/lib/modes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { hasDocumentAccess } from "@/lib/access";

const DocumentToolbar = () => {
  const { document, isLoading: isDocumentLoading } = useDocument();
  const { currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();
  const { camera, setCamera } = useCamera();
  const searchParams = useSearchParams();
  const project_id = searchParams.get("project_id");
  const router = useRouter();
  const { documents, isLoading: isDocumentsLoading, error } = useDocuments();
  const { canvasMode, setCanvasMode } = useCanvasMode();
  const accessLevel = useMemo(
    () =>
      document && currentUser && !isCurrentUserLoading && !isDocumentLoading
        ? hasDocumentAccess(document, currentUser.id)
        : false,
    [document, currentUser, isCurrentUserLoading, isDocumentLoading]
  );

  const hasAccess = useMemo(
    () => accessLevel === "write" || accessLevel === "admin",
    [accessLevel]
  );

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= documents?.length),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      page: `${document?.order ?? 1}`,
    },
    resolver: zodResolver(CustomPageValidator),
  });

  const handlePageSubmit = ({ page }) => {
    const newDocument = documents.find((d) => d.order === Number(page));
    router.push(`/projects/${project_id}/${newDocument.id}`);
  };

  useEffect(() => {
    const currentValue = getValues("page");
    if (document && currentValue !== String(document?.order)) {
      setValue("page", String(document?.order ?? 1));
    }
  }, [document]);

  return (
    <>
      <div className="absolute z-1 bottom-3 w-full flex items-center justify-center ">
        <div className="bg-background px-3 border h-14 max-w-[620px] w-full flex items-center justify-between rounded-xl">
          <div className="flex items-center gap-1.5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  asChild
                  className="flex items-center-justify-center"
                >
                  <Button
                    // size="icon"
                    disabled={document?.order <= 1}
                    onClick={() => {
                      // find the document with the coresponse order
                      const newPageNum =
                        document?.order - 1 > 1 ? document?.order - 1 : 1;
                      const newDocument = documents.find(
                        (d) => d.order === newPageNum
                      );
                      router.push(`/projects/${project_id}/${newDocument.id}`);
                    }}
                    variant="ghost"
                    aria-label="previous page"
                    className="px-2"
                  >
                    <LucideIcon name="chevron-left" className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Previous page</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex items-center gap-1.5">
              <Input
                {...register("page")}
                className={cn(
                  "w-12 h-8",
                  errors.page && "focus-visible:ring-red-500"
                )}
                onBlur={() => {
                  const currentValue = getValues("page");
                  if (document && currentValue !== String(document?.order)) {
                    handleSubmit(handlePageSubmit)();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(handlePageSubmit)();
                  }
                }}
              />
              <p className="text-zinc-700 text-sm space-x-1">
                <span>/</span>
                <span>{documents?.length ?? "x"}</span>
              </p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  asChild
                  className="flex items-center-justify-center"
                >
                  <Button
                    // size="icon"
                    disabled={
                      documents?.length === undefined ||
                      document?.order === documents?.length
                    }
                    onClick={() => {
                      const newPageNum =
                        document?.order + 1 > documents?.length
                          ? documents?.length
                          : document?.order + 1;
                      const newDocument = documents.find(
                        (d) => d.order === newPageNum
                      );
                      router.push(`/projects/${project_id}/${newDocument.id}`);
                    }}
                    variant="ghost"
                    aria-label="next page"
                    className="px-2"
                  >
                    <LucideIcon name="chevron-right" className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Next page</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex space-x-1.5">
            <div className="flex">
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
                            className="gap-1.5"
                            aria-label="scale"
                            variant="ghost"
                          >
                            <LucideIcon name="zoom-in" className="h-4 w-4" />
                            {camera.scale * 100}%
                            <LucideIcon
                              name="chevron-down"
                              className="h-3 w-3 opacity-50"
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Zoom</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onSelect={() =>
                      setCamera({
                        ...camera,
                        scale: 0.5,
                      })
                    }
                  >
                    50%
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      setCamera({
                        ...camera,
                        scale: 1,
                      })
                    }
                  >
                    100%
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      setCamera({
                        ...camera,
                        scale: 1.5,
                      })
                    }
                  >
                    150%
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      setCamera({
                        ...camera,
                        scale: 2,
                      })
                    }
                  >
                    200%
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      setCamera({
                        ...camera,
                        scale: 2.5,
                      })
                    }
                  >
                    250%
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  asChild
                  className="flex items-center-justify-center"
                > */}
            {hasAccess && (
              <Button
                onClick={() =>
                  setCanvasMode(
                    canvasMode === modes.commenting
                      ? modes.none
                      : modes.commenting
                  )
                }
                variant={
                  canvasMode === modes.commenting ? "default" : "outline"
                }
                aria-label="enable commenting"
                className="border-foreground/10 border"
              >
                <LucideIcon name="message-circle" className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            )}
            {/* </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Comment</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}
            {/* <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  asChild
                  className="flex items-center-justify-center"
                >
                  <Button
                    onClick={() =>
                      setCamera({
                        ...camera,
                        rotation: camera.rotation + 90,
                      })
                    }
                    variant="ghost"
                    aria-label="rotate 90 degrees"
                    className="px-2"
                  >
                    <LucideIcon name="rotate-cw" className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Rotate</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}

            {/* <PdfFullscreen fileUrl={url} /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentToolbar;
