// useCamera.js
import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";

export const cameraState = atom({
  key: "camera",
  default: { x: 0, y: 0, scale: 1, rotation: 0 },
});

export const useCamera = () => {
  const [camera, setCamera] = useRecoilState(cameraState);

  const onWheel = useCallback(
    (e) => {
      setCamera((camera) => {
        const newX = camera.x - e.deltaX;

        const newY = camera.y - e.deltaY;

        const updatedCamera = {
          ...camera,
          x: newX,
          y: newY,
        };

        return updatedCamera;
      });
    },
    [camera]
  );

  return {
    camera,
    setCamera,
    onWheel,
  };
};
