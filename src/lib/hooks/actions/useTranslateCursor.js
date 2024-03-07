import { useMutation, useUpdateMyPresence } from "@/lib/liveblocks";
import { useRecoilValue } from "recoil";
import { cameraState } from "../useCamera";

// this hook can only be use in components that are within the RoomProvider
export const useTranslateCursor = () => {
  const camera = useRecoilValue(cameraState);
  const updateMyPresence = useUpdateMyPresence();
  // Ensure ref is attached to canvasRef

  /**
   * Move selected layers on the canvas
   */
  const translateCursor = useMutation(
    ({ self }, point, height, width) => {
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
      const offsetX = 330 / camera.scale;

      updateMyPresence({
        cursor: {
          x: relativeX - offsetX,
          y: relativeY,
        },
        camera: camera,
      });
    },
    [camera]
  );

  /**
   * Move selected layers on the canvas
   */
  const removeCursor = useMutation(
    ({ self }) => {
      // Calculate the center of the canvas
      updateMyPresence({
        cursor: null,
      });
    },
    [camera]
  );

  return { translateCursor, removeCursor };
};
