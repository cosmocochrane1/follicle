import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocuments } from "@/lib/hooks/useDocuments";
import { DocumentActionMenu } from "./DocumentActionMenu";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { hasDocumentAccess } from "@/lib/access";
import LucideIcon from "../../LucideIcon";
import Sortable from "sortablejs";
import { useEffect, useMemo, useRef, useState } from "react";
import useUpdateDocumentOrder from "@/lib/hooks/actions/useUpdateDocumentOrder";
import { Button } from "@/components/ui/button";
import { getTimeFromNow } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { EmptyStateCard } from "@/components/EmptyStateCard";
import { DocumentUploadButton } from "../DocumentUploadButton";

export default function DocumentGrid({
  group,
  className,
  accessLevel,
  ...props
}) {
  const gridRef = useRef(null);
  const sortableJsRef = useRef(null);
  const searchparams = useSearchParams();
  const project_id = searchparams.get("project_id");
  const { currentUser } = useCurrentUser();
  const { documents, isLoading } = useDocuments();
  const {
    updateDocumentOrder,
    isLoading: isUpdateDocumentLoading,
    error,
  } = useUpdateDocumentOrder();

  const onListChange = (event) => {
    const { item, newIndex } = event;
    const documentId = item.id;

    updateDocumentOrder({
      documentId: documentId,
      order: newIndex + 1,
    });
  };

  useEffect(() => {
    if (accessLevel && accessLevel !== "read") {
      sortableJsRef.current = new Sortable(gridRef.current, {
        animation: 150,
        onEnd: onListChange,
        onUpdate: onListChange,
      });
    }
  }, [accessLevel]);

  const showDocuments = useMemo(() => {
    return !isLoading && documents && currentUser && Array.isArray(documents);
  }, [isLoading, documents, currentUser]);

  const showEmptyState = useMemo(() => {
    return !isLoading && (!documents || documents.length === 0);
  }, [isLoading, documents]);

  return (
    <>
      <ul className="grid grid-cols-3 gap-4 gap-y-8 w-full pb-16" ref={gridRef}>
        {isLoading &&
          [...Array(6)].map((_, i) => (
            <div
              className="flex flex-col items-center justify-center p-0"
              key={i}
            >
              <Skeleton className="h-56 w-full rounded-lg bg-foreground/5 mb-3" />
            </div>
          ))}
        {showDocuments &&
          [...documents].map((document, i) => {
            const accessLevel = hasDocumentAccess(document, currentUser?.id);
            return (
              <li className="relative" key={document.id} id={document.id}>
                <Link
                  href={`/projects/${project_id}/${document.id}`}
                  className="group"
                >
                  <div className="pb-4 flex items-center">
                    <div className="flex items-start jsutify-center flex-col">
                      <h4 className="text-sm w-auto rounded-md pr-3">
                        {document.name}
                      </h4>
                      <p className="text-xs pr-3 text-foreground/80">
                        Edited {getTimeFromNow(document.updated_at)}
                      </p>
                    </div>
                  </div>
                  <div
                    key={document.id}
                    className="relative h-56 flex flex-col items-center justify-center border bg-card group-hover:bg-card/70 hover:bg-card/70 rounded-lg"
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
                        <div className="items-center justify-center flex h-40 w-32 rounded-lg p-4 pr-0">
                          <LucideIcon name="file" className="w-32 h-32" />
                        </div>
                      )}
                    </>
                    {/* </div> */}
                  </div>
                  <div className="pt-2 flex items-center justify-center">
                    <Badge
                      className={`bg-foreground text-background hover:bg-foreground/80`}
                    >
                      Page {document.order}
                    </Badge>
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
                    <div className="absolute top-0 right-0">
                      <DocumentActionMenu
                        document={document}
                        accessLevel={accessLevel}
                      />
                    </div>
                  )}
              </li>
            );
          })}
        <div
          className={`absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-background/70 backdrop-blur-[1px]   transition-all ${
            showEmptyState ? "duration-500" : "duration-300"
          } ease-in-out
          transform  ${
            showEmptyState ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <EmptyStateCard
            title="Upload your first file"
            actions={[
              <div key="empty-state-upload-document">
                <DocumentUploadButton className="w-auto" />
              </div>,
            ]}
          >
            <p className="text-foreground/70 leading-relaxed">
              Your project is ready for its first blueprint. <br />
              Upload your files to get started.
            </p>
          </EmptyStateCard>
        </div>
      </ul>
    </>
  );
}
