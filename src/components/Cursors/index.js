import React, { useEffect } from "react";
import Cursor from "./Cursor";
import { useOthersMapped } from "@/lib/liveblocks";
import { useTranslateCursor } from "@/lib/hooks/actions/useTranslateCursor";
import { useResizeDetector } from "react-resize-detector";
import { getPoint } from "@/lib/utils";

export default function Cursors({ canvasRef }) {
  const others = useOthersMapped((other) => ({
    cursor: other.presence.cursor,
    camera: other.presence.camera,
    info: other.info,
  }));
  const { translateCursor, removeCursor } = useTranslateCursor();
  // Detect canvas resize
  const { width, height } = useResizeDetector({ targetRef: canvasRef });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handlePointerMove = (e) => {
      const point = getPoint(e);
      translateCursor(point, height, width);
    };

    const handlePointerLeave = (e) => {
      removeCursor();
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [height, width, translateCursor, removeCursor]);

  return (
    <>
      {
        /**
         * Iterate over other users and display a cursor based on their presence
         */
        others.map(([id, other]) => {
          if (other.cursor == null) {
            return null;
          }
          return (
            <Cursor
              canvasRef={canvasRef}
              other={other}
              id={id}
              key={other.email}
            />
          );
        })
      }
    </>
  );
}
