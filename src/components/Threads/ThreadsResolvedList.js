// pages/index.js
import { useThreads } from "@/lib/liveblocks";
import { Thread } from "@liveblocks/react-comments";
import { useSelectedThread } from "@/lib/hooks/useSelectedThread";
import { useMemo } from "react";
import { hasDocumentAccess } from "@/lib/access";
import { useDocument } from "@/lib/hooks/useDocument";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

export default function ThreadsResolvedList({}) {
  const threads = useThreads();
  const { setSelectedThread } = useSelectedThread();
  const { document, isLoading: isDocumentLoading } = useDocument();
  const { currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();

  const filteredThreads = useMemo(
    () => threads.filter((thread) => thread.metadata.resolved),
    [threads]
  );

  const showEmptyState = useMemo(() => {
    return !filteredThreads || filteredThreads?.length === 0;
  }, [filteredThreads]);

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

  return (
    <>
      <div className="overflow-y-auto flex flex-grow flex-col-reverse ">
        {filteredThreads.map((thread) => {
          return (
            <div key={thread.id} className="border-b">
              <Thread
                key={thread.id}
                thread={thread}
                onClick={() => {
                  setSelectedThread(thread.id);
                }}
                showComposer={false}
                showResolveAction={hasAccess}
                showActions={hasAccess}
                className="bg-background"
              />
            </div>
          );
        })}
        {showEmptyState && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center px-4  pointer-events-none">
            <p className="text-foreground/70 leading-relaxed text-center">
              Any comment you resolve will end up here. You can always unresolve
              a comment to bring it back to the file.
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-1"></div>
    </>
  );
}
