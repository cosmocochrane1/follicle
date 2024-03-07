import { useCamera } from "@/lib/hooks/useCamera";
import { memo, useState, useMemo, useEffect } from "react";

const BackgroundGrid = () => {
  const { camera } = useCamera();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const gridStyle = useMemo(() => {
    if (isClient) {
      // Assuming `camera.scale` is your zoom level (1 being 100%, 0.5 being 50%, etc.)
      const backgroundPositionX = camera.x % window.innerWidth;
      const backgroundPositionY = camera.y % window.innerHeight;

      // Adjust the `background-size` if needed to ensure it covers the full screen at different zoom levels
      const backgroundSize = `${16 * camera.scale}px ${16 * camera.scale}px`;

      return {
        background: `radial-gradient(circle at 0.5px 0.5px, var(--lb-foreground) 0.5px, transparent 0.5px)`,

        backgroundPosition: `${backgroundPositionX}px ${backgroundPositionY}px`,
        backgroundSize: backgroundSize,
      };
    }
    return {};
  }, [isClient, camera.scale, camera.x, camera.y]);

  return (
    <>
      <div
        className="absolute inset-0 h-screen w-screen [background-size:16px_16px] opacity-40"
        style={gridStyle}
      />
    </>
  );
};

const MemoizedBackgroundGrid = memo(BackgroundGrid);

export default MemoizedBackgroundGrid;
