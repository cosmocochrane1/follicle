import { useCamera } from "@/lib/hooks/useCamera";
import React, { useEffect, useMemo, useState } from "react";

import { useResizeDetector } from "react-resize-detector";
import { stringToColor } from "@/lib/utils";
import { useTranslateCursor } from "@/lib/hooks/actions/useTranslateCursor";

export default function Cursor({ other, canvasRef }) {
  const { camera } = useCamera();
  const user = other.info;
  const metadata = other.cursor;
  const otherCamera = other.camera;

  // Detect canvas resize
  const { width, height, ref } = useResizeDetector({ targetRef: canvasRef });

  // State to store the relative position
  const [relativePosition, setRelativePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Ensure ref is attached to canvasRef
    ref(canvasRef.current);

    // Calculate the center of the canvas
    const centerX = width / 2;
    const centerY = height / 2;

    // Adjust the cursor's position based on the camera difference
    const adjustedX = metadata.x - otherCamera.x;
    const adjustedY = metadata.y - otherCamera.y;

    // Scale the adjusted position
    const relativeX = (adjustedX - centerX) * camera.scale + centerX;
    const relativeY = (adjustedY - centerY) * camera.scale + centerY;

    setRelativePosition({
      x: relativeX,
      y: relativeY,
    });
  }, [
    width,
    height,
    camera,
    camera.scale,
    metadata.x,
    metadata.y,
    otherCamera.x,
    otherCamera.y,
    canvasRef,
  ]);

  const color = useMemo(
    () => stringToColor(user.name + "-" + user.email),
    [user.name, user.email]
  );

  const style = useMemo(() => {
    return {
      left: relativePosition.x,
      top: relativePosition.y,
      transform: `translate(${camera.x}px, ${camera.y}px)`,
    };
  }, [camera.x, camera.y, relativePosition.x, relativePosition.y]);

  const otherStyle = useMemo(() => {
    return {
      transform: `translate(${otherCamera.x}px, ${otherCamera.y}px)`,
    };
  }, [otherCamera.x, otherCamera.y]);

  return (
    <div className={`absolute`} style={style}>
      <div style={otherStyle}>
        <div className="flex items-start justify-start gap-3">
          <div className="relative">
            <svg
              className="absolute top-0 left-0"
              width="32"
              height="44"
              viewBox="0 0 24 36"
              fill="none"
            >
              <path
                fill={color}
                d="M0.928548 2.18278C0.619075 1.37094 1.42087 0.577818 2.2293 0.896107L14.3863 5.68247C15.2271 6.0135 15.2325 7.20148 14.3947 7.54008L9.85984 9.373C9.61167 9.47331 9.41408 9.66891 9.31127 9.91604L7.43907 14.4165C7.09186 15.2511 5.90335 15.2333 5.58136 14.3886L0.928548 2.18278Z"
              />
            </svg>
            <div
              style={{
                backgroundColor: color,
              }}
              className={`absolute overflow-hidden top-3.5 left-3.5 pt-1 pb-1 pl-2 pr-2 text-xs leading-5 font-medium whitespace-nowrap rounded-md`}
            >
              <div className="relative text-background dark:text-foreground">
                {user.name || user.email}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
