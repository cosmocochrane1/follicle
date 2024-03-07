// pages/index.js
import { RoomProvider } from "@/lib/liveblocks";

import { LiveList, LiveMap } from "@liveblocks/client";
import LiveblocksErrorHandler from "@/components/LiveblocksErrorHandler";
import { ClientSideSuspense } from "@liveblocks/react";
import { cn } from "@/lib/utils";
import { DocumentLoader } from "@/components/Documents/Document";

export default function Room({
  children,
  roomId,
  className,
  fallback = (
    <div className="absolute top-0 left-0 right-0 bottom-0">
      <DocumentLoader />
    </div>
  ),
}) {
  return (
    <>
      <RoomProvider
        id={roomId || "fallback"}
        initialPresence={{
          selection: [],
          cursor: null,
        }}
        initialStorage={{
          layers: new LiveMap(),
          layerIds: new LiveList(),
          notes: new LiveMap(),
        }}
        className={className}
      >
        <LiveblocksErrorHandler>
          <ClientSideSuspense fallback={fallback}>
            {children}
          </ClientSideSuspense>
        </LiveblocksErrorHandler>
      </RoomProvider>
    </>
  );
}
