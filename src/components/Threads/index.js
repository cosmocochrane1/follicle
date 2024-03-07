import { useThreads } from "@/lib/liveblocks";
import React, { memo, useMemo } from "react";

import Thread from "./Thread";
import { useSelectedThread } from "@/lib/hooks/useSelectedThread";
import { hasDocumentAccess } from "@/lib/access";
import { useDocument } from "@/lib/hooks/useDocument";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";

const Threads = ({ canvasRef }) => {
  const threads = useThreads();
  const { selectedThread } = useSelectedThread();
  const { document, isLoading: isDocumentLoading } = useDocument();
  const { currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();

  // Filter out resolved threads
  const unresolvedThreads = useMemo(
    () => threads.filter((t) => !t.metadata.resolved),
    [threads]
  );

  // Sort the threads to ensure the selected thread is first
  const sortedThreads = useMemo(
    () =>
      unresolvedThreads.sort((a, b) => {
        if (a.id === selectedThread) return 1;
        if (b.id === selectedThread) return -1;
        return 0;
      }),
    [unresolvedThreads, selectedThread]
  );

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
    <div>
      {sortedThreads.map((t) => (
        <Thread
          key={t.id}
          thread={t}
          canvasRef={canvasRef}
          hasAccess={hasAccess}
        />
      ))}
    </div>
  );
};

const MemoizedThreads = memo(Threads);

export default MemoizedThreads;
