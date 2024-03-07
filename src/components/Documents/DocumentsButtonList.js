// pages/index.js
import { Button } from "../ui/button";
import LucideIcon from "../LucideIcon";
import { Skeleton } from "../ui/skeleton";
import { getTimeFromNow } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useDocuments } from "@/lib/hooks/useDocuments";
import useUpdateDocumentOrder from "@/lib/hooks/actions/useUpdateDocumentOrder";
import { hasDocumentAccess, hasProjectAccess } from "@/lib/access";
import Sortable from "sortablejs";
import { DocumentActionMenu } from "./DocumentGrid/DocumentActionMenu";
import { useProjects } from "@/lib/hooks/useProjects";

export default function DocumentsButtonList() {
  const [open, setOpen] = useState(false);
  const listRef = useRef(null);
  const sortableJsRef = useRef(null);
  const searchparams = useSearchParams();
  const project_id = searchparams.get("project_id");
  const { currentUser } = useCurrentUser();
  const { projects, isLoading: isProjecsLoading } = useProjects();
  const { documents, isLoading } = useDocuments();

  const project = projects?.find((project) => project.id === project_id);
  const accessLevel =
    project && currentUser && hasProjectAccess(project, currentUser?.id);

  const {
    updateDocumentOrder,
    isLoading: isUpdateDocumentLoading,
    error,
  } = useUpdateDocumentOrder();

  const onListChange = async (event) => {
    const { item, newIndex } = event;
    const documentId = item.id;

    await updateDocumentOrder({
      documentId: documentId,
      order: newIndex + 1,
    });
  };

  useEffect(() => {
    if (accessLevel && accessLevel !== "read") {
      sortableJsRef.current = new Sortable(listRef.current, {
        animation: 150,
        onEnd: onListChange,
        onUpdate: onListChange,
      });
    }
  }, [accessLevel]);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          setOpen(true);
        }}
        className={`absolute right-4 top-20 border-color-border hover:bg-gray-200 dark:hover:bg-gray-700`}
      >
        <LucideIcon name="layers" className="h-5 w-5 mr-2" />
        Pages
      </Button>
      <div
        onClick={() => {
          setOpen(false);
        }}
        className={`
          absolute right-0 top-0 bottom-0 left-0 w-full h-ful bg-background/70 backdrop-blur-[1px]
          transition-all ${open ? "duration-500" : "duration-300"} ease-in-out
          transform  ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />
      <aside
        onWheel={(e) => {
          e.stopPropagation();
        }}
        className={`
          z-1 absolute right-0 top-0 bottom-0 w-[325px] flex flex-col h-full bg-background border-l overflow-hidden text-foreground 
          transition-all ${open ? "duration-500" : "duration-300"} ease-in-out
          transform ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="h-[75px] w-full"></div>
        {/* <div className="items-center gap-x-3 px-6 justify-between flex flex-1 pt-[53px]" /> */}
        <section className="w-full flex items-center justify-between border-b py-1 px-6">
          <span className="flex items-center justify-center gap-x-1 text-md capitalize text-start">
            <LucideIcon name="layers" className="h-5 w-5 mr-2" />
            Pages
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setOpen(false);
            }}
          >
            <LucideIcon name="x" className="h-5 w-5" />
          </Button>
        </section>
        <div className="h-full overflow-y-auto ">
          <ul
            className="grid grid-cols-2 gap-4 gap-y-4 w-full px-3 py-4"
            ref={listRef}
          >
            {isLoading &&
              [...Array(6)].map((_, i) => (
                <div
                  className="flex flex-col items-center justify-center p-0"
                  key={i}
                >
                  <Skeleton className="h-56 w-full rounded-lg bg-foreground/5 mb-3" />
                </div>
              ))}
            {!isLoading &&
              documents &&
              currentUser &&
              Array.isArray(documents) &&
              [...documents].map((document, i) => {
                const accessLevel = hasDocumentAccess(
                  document,
                  currentUser?.id
                );
                return (
                  <li
                    className="relative group"
                    key={document.id}
                    id={document.id}
                  >
                    <Link
                      href={`/projects/${project_id}/${document.id}`}
                      className="group"
                      onClick={() => setOpen(false)}
                    >
                      <div
                        key={document.id}
                        className="relative aspect-square flex flex-col items-center justify-center border bg-card group-hover:bg-card/70 hover:bg-card/70 rounded-lg"
                      >
                        {/* <div className="flex h-40 flex-col items-center w-full"> */}
                        <>
                          {document.thumbnail_url ? (
                            <img
                              src={document.thumbnail_url}
                              alt={`Thumbnail for ${document.name}`}
                              className="object-cover h-full w-full rounded-lg "
                            />
                          ) : (
                            <div className="items-center justify-center flex h-40 w-32 rounded-lg p-4">
                              <LucideIcon name="file" className="w-32 h-32" />
                            </div>
                          )}
                        </>
                        {/* </div> */}
                      </div>
                      <div className="pt-2 flex items-center">
                        <h4 className="text-sm w-auto rounded-md px-0">
                          {document.name}
                        </h4>
                      </div>
                    </Link>
                    {isUpdateDocumentLoading && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-0"
                        disabled={true}
                      >
                        <LucideIcon
                          name="loader-2"
                          className="h-4 w-4 animate-spin"
                        />
                      </Button>
                    )}
                    {!isUpdateDocumentLoading &&
                      (accessLevel == "admin" || accessLevel == "write") && (
                        <div className="absolute top-2 right-2 opacity-0 transition-all group-hover:opacity-100 group-hover:bg-background/40 rounded-md">
                          <DocumentActionMenu
                            document={document}
                            accessLevel={accessLevel}
                          />
                        </div>
                      )}
                  </li>
                );
              })}
          </ul>
        </div>
      </aside>
    </>
  );
}
