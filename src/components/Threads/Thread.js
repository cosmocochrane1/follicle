import { useMutation, useUser } from "@/lib/liveblocks";
import { Card } from "../ui/card";
import { Thread as LiveblocksThread } from "@liveblocks/react-comments";
import { useCamera } from "@/lib/hooks/useCamera";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { GenericAvatar } from "../GenericAvatar";
import { useSelectedThread } from "@/lib/hooks/useSelectedThread";
import { useResizeDetector } from "react-resize-detector";
import { useTranslateThread } from "@/lib/hooks/actions/useTranslateThread";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getPoint } from "@/lib/utils";

const DRAG_THRESHOLD = 10;

export default function Thread({ thread, canvasRef, hasAccess = false }) {
  const threadRef = useRef();
  const { camera } = useCamera();
  const { selectedThread, setSelectedThread } = useSelectedThread();
  const { onThreadPointerDown, translateSelectedThreads } =
    useTranslateThread();

  const { metadata } = thread;
  const { user, isLoading } = useUser(thread.comments[0].userId);

  // Detect canvas resize
  const { width, height, ref } = useResizeDetector({ targetRef: canvasRef });

  // State to store the relative position
  const [relativePosition, setRelativePosition] = useState({ x: 0, y: 0 });
  const [dragPositon, setDragPositon] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [activeThread, setActiveThread] = useState(null);

  const style = useMemo(() => {
    if (relativePosition && relativePosition.x && relativePosition.y) {
      return {
        left: relativePosition.x,
        top: relativePosition.y,
        transform: `translate(${camera.x}px, ${camera.y}px)`,
      };
    }
    return {
      transform: `translate(${camera.x}px, ${camera.y}px)`,
    };
  }, [camera.x, camera.y, relativePosition.x, relativePosition.y]);

  useEffect(() => {
    // Ensure ref is attached to canvasRef
    ref(canvasRef.current);

    // Calculate the center of the canvas
    const centerX = width / 2;
    const centerY = height / 2;

    // Convert camera.rotation from degrees to radians for the math functions
    const radians = camera.rotation * (Math.PI / 180);

    // Calculate the thread's new position after rotation around the canvas center
    const dx = (metadata.x - centerX) * camera.scale;
    const dy = (metadata.y - centerY) * camera.scale;

    const rotatedX = dx * Math.cos(radians) - dy * Math.sin(radians) + centerX;
    const rotatedY = dx * Math.sin(radians) + dy * Math.cos(radians) + centerY;

    setRelativePosition({ x: rotatedX || 0, y: rotatedY || 0 });
  }, [
    width,
    height,
    camera.scale,
    camera.rotation,
    metadata.x,
    metadata.y,
    canvasRef,
  ]);

  /**
   * Move selected layers on the canvas
   */
  const translateLocalThread = useCallback(
    (point) => {
      if (!isDragging) {
        return;
      }
      if (!threadRef.current) {
        return;
      }

      // Adjust point coordinates based on the camera position
      const adjustedPointX = point.x - camera.x;
      const adjustedPointY = point.y - camera.y;

      // Calculate the thread's position relative to the center, scaled by the camera
      const relativeX = adjustedPointX;
      const relativeY = adjustedPointY;

      // these offsets are hardcoded for now
      const offsetX = 360 - 16;
      const offsetY = 16;

      setRelativePosition({
        x: relativeX - offsetX,
        y: relativeY - offsetY,
      });
    },
    [camera, thread, isDragging, threadRef]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handlePointerMove = (e) => {
      const point = getPoint(e);
      const moveDistance = Math.sqrt(
        Math.pow(point.x - dragPositon.x, 2) +
          Math.pow(point.y - dragPositon.y, 2)
      );
      if (
        moveDistance > DRAG_THRESHOLD &&
        isDragging &&
        activeThread === thread.id
      ) {
        translateLocalThread(point);
      }
    };

    const handlePointerLeave = (e) => {
      if (isDragging && activeThread === thread.id) {
        const point = getPoint(e);
        translateSelectedThreads(point, height, width);
        setIsDragging(false);
        setActiveThread(null);
        setDragPositon({ x: 0, y: 0 });
      }
    };

    const handlePointerUp = (e) => {
      if (isDragging && activeThread === thread.id) {
        const point = getPoint(e);

        const moveDistance = Math.sqrt(
          Math.pow(point.x - dragPositon.x, 2) +
            Math.pow(point.y - dragPositon.y, 2)
        );
        if (moveDistance > DRAG_THRESHOLD)
          translateSelectedThreads(point, height, width);
        setIsDragging(false);
        setActiveThread(null);
        setDragPositon({ x: 0, y: 0 });
      }
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("pointerup", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("pointerup", handlePointerUp);
    };
  }, [
    isDragging,
    activeThread,
    height,
    width,
    translateLocalThread,
    translateSelectedThreads,
  ]);

  return (
    <div
      className={`absolute max-w-[460px] ${
        isDragging ? "pointer-events-none" : "pointer-events-auto"
      }`}
      style={style}
      ref={threadRef}
    >
      <div className={`flex items-start justify-start gap-3 `}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div
                onPointerDown={(e) => {
                  if (hasAccess) {
                    setIsDragging(true);
                    setActiveThread(thread.id);
                    onThreadPointerDown(thread.id);
                    setDragPositon({ x: e.clientX, y: e.clientY });
                  }
                  setSelectedThread(thread.id);
                }}
                className="border-2 border-foreground cursor-pointer transition-all hover:scale-110 rounded-r-full rounded-b-full bg-foreground aspect-square h-9 w-9"
              >
                <GenericAvatar src={user.avatar} email={user.email} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{user.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {selectedThread === thread.id && (
          <Card className={`rounded-lg w-full overflow-hidden `}>
            <LiveblocksThread
              key={thread.id}
              thread={thread}
              showComposer={selectedThread === thread.id && hasAccess}
              showResolveAction={selectedThread === thread.id && hasAccess}
              showActions={selectedThread === thread.id && hasAccess}
              className={`bg-background `}
            />
          </Card>
        )}
      </div>
    </div>
  );
}
