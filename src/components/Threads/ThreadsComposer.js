import LucideIcon from "../LucideIcon";
import { useCamera } from "@/lib/hooks/useCamera";

import { Composer } from "@liveblocks/react-comments";
import { Card } from "../ui/card";
import { GenericAvatar } from "../GenericAvatar";
import { useCreateThread, useSelf } from "@/lib/liveblocks";
import { useComposer } from "@/lib/hooks/useComposer";
import { useResizeDetector } from "react-resize-detector";

const ThreadsComposer = ({ canvasRef }) => {
  const { info } = useSelf();
  const { camera } = useCamera();
  const { composerPosition, composerOpen, setComposerOpen } = useComposer();
  const createThread = useCreateThread();

  // Detect canvas resize
  const { width, height, ref } = useResizeDetector({ targetRef: canvasRef });

  const onComposerSubmit = ({ body }, event) => {
    event.preventDefault();

    // Ensure ref is attached to canvasRef
    ref(canvasRef.current);

    // Calculate the center of the canvas
    const centerX = width / 2;
    const centerY = height / 2;

    // Calculate the thread's position relative to the center, scaled by the camera
    const relativeX = (composerPosition.x - centerX) / camera.scale + centerX;
    const relativeY = (composerPosition.y - centerY) / camera.scale + centerY;

    createThread({
      body,
      metadata: {
        x: relativeX,
        y: relativeY,
      },
    });
    setComposerOpen(false);
  };

  return (
    <>
      {composerOpen && (
        <div
          className={`absolute w-[360px]`}
          style={{
            left: `${composerPosition.x}px`,
            top: `${composerPosition.y}px`,
            transform: `translate(${camera.x}px, ${camera.y}px)`,
          }}
        >
          <div className="flex items-start justify-start gap-3">
            <div className="border-2 border-foreground rounded-r-full rounded-b-full bg-foreground aspect-square h-9 w-9">
              <GenericAvatar src={info.avatar_url} email={info.email} />
            </div>
            <Card className="rounded-lg w-full overflow-hidden">
              <Composer onComposerSubmit={onComposerSubmit} />
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default ThreadsComposer;
