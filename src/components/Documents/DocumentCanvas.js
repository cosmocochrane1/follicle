import { useCamera } from "@/lib/hooks/useCamera";
import { useCanvasMode } from "@/lib/hooks/useCanvasMode";
import { modes } from "@/lib/modes";
import DocumentPdf from "./DocumentPdf";
import { memo, useCallback, useMemo, useState } from "react";
import { useComposer } from "@/lib/hooks/useComposer";
import { useSelectedThread } from "@/lib/hooks/useSelectedThread";

const DocumentCanvas = ({ url, width, canvasRef, setIsLoadingPdf }) => {
  const { camera, onWheel } = useCamera();
  const { composerOpen, setComposerOpen, setComposerPositon } = useComposer();
  const { selectedThread, setSelectedThread } = useSelectedThread();

  const { canvasMode, setCanvasMode } = useCanvasMode();

  const style = useMemo(() => {
    return {
      transform: `translate(${camera.x}px, ${camera.y}px) rotate(${camera.rotation}deg)`,
    };
  }, [camera.rotation, camera.x, camera.y]);

  const onClick = useCallback(
    (e) => {
      if (canvasMode === modes.commenting) {
        e.stopPropagation();
        // Adjusting the composerPosition based on the camera transformation
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - camera.x;
        const y = e.clientY - rect.top - camera.y;

        setCanvasMode(modes.none);
        setComposerPositon({ x, y });
        setComposerOpen(true);
      } else if (selectedThread) {
        e.stopPropagation();
        setSelectedThread(null);
      } else if (composerOpen === true) {
        e.stopPropagation();
        setComposerOpen(false);
      }
    },
    [camera.x, camera.y, canvasMode, selectedThread, composerOpen]
  );

  return (
    <>
      <div
        className={`absolute min-w-full flex flex-col items-center min-h-full top-0 left-0 right-0 bottom-0 overflow-hidde  ${
          canvasMode === modes.translating && "select-none"
        }  ${canvasMode === modes.commenting && "cursor-copy"}`}
        onWheel={onWheel}
        onClick={onClick}
        ref={canvasRef}
      >
        <div
          className={`relative min-w-full h-full flex-1 flex justify-center items-center z-0 w-full max-h-full`}
          style={style}
        >
          <DocumentPdf
            url={url}
            width={width}
            scale={camera.scale}
            setIsLoadingPdf={setIsLoadingPdf}
          />
        </div>
      </div>
    </>
  );
};

const MemoizedDocumentCanvas = memo(DocumentCanvas);

export default MemoizedDocumentCanvas;
