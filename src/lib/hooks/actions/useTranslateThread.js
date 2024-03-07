import {
  useEditThreadMetadata,
  useHistory,
  useMutation,
  useThreads,
} from "@/lib/liveblocks";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { canvasModeState } from "../useCanvasMode";
import { modes } from "@/lib/modes";
import { cameraState } from "../useCamera";

// this hook can only be use in components that are within the RoomProvider
export const useTranslateThread = () => {
  const camera = useRecoilValue(cameraState);
  const canvasMode = useRecoilValue(canvasModeState);
  const setCanvasMode = useSetRecoilState(canvasModeState);
  const history = useHistory();
  const threads = useThreads();
  const editThread = useEditThreadMetadata();
  // Ensure ref is attached to canvasRef

  /**
   * Select the thread if not already selected and start translating the selection
   */
  const onThreadPointerDown = useMutation(
    ({ self, setMyPresence }, threadId) => {
      history.pause();

      // If no threadId is provided, insert a new layer at the pointer location
      if (!threadId) {
        return;
      }

      if (!self.presence.selection.includes(threadId)) {
        setMyPresence({ selection: [threadId] }, { addToHistory: true });
      }
      setCanvasMode(modes.translating);
    },
    [setCanvasMode, history]
  );

  /**
   * Move selected layers on the canvas
   */
  // NOTE: This function does not work correctly when camera is rotated by factor of 90 degrees.
  const translateSelectedThreads = useMutation(
    ({ self }, point, height, width) => {
      if (canvasMode !== modes.translating) {
        return;
      }

      for (const id of self.presence.selection) {
        const thread = threads.find((thread) => thread.id === id);
        if (thread) {
          // Calculate the center of the canvas
          const centerX = width / 2;
          const centerY = height / 2;

          // Adjust point coordinates based on the camera position
          const adjustedPointX = point.x - camera.x;
          const adjustedPointY = point.y - camera.y;

          // Calculate the thread's position relative to the center, scaled by the camera
          const relativeX = (adjustedPointX - centerX) / camera.scale + centerX;
          const relativeY = (adjustedPointY - centerY) / camera.scale + centerY;

          // Apply scaling to the fixed offsets
          // these offsets are hardcoded for now
          const offsetX = (360 - 16) / camera.scale;
          const offsetY = 16 / camera.scale;

          const nonRotatedPoint = {
            x: relativeX - offsetX,
            y: relativeY - offsetY,
          };

          // Convert camera.rotation from degrees to radians for the math functions
          const radians = camera.rotation * (Math.PI / 180);

          // Calculate the thread's new position after rotation around the canvas center
          const dx = nonRotatedPoint.x - centerX;
          const dy = nonRotatedPoint.y - centerY;

          const rotatedX =
            dx * Math.cos(radians) - dy * Math.sin(radians) + centerX;
          const rotatedY =
            dx * Math.sin(radians) + dy * Math.cos(radians) + centerY;

          editThread({
            threadId: thread.id,
            metadata: {
              x: rotatedX,
              y: rotatedY,
            },
          });
        }
      }

      setCanvasMode(modes.translating);
    },
    [canvasMode, camera, threads]
  );

  return { onThreadPointerDown, translateSelectedThreads };
};
