// useCanvasMode.js
import { atom, useRecoilState } from "recoil";
import { modes } from "../modes";

export const canvasModeState = atom({
  key: "canvas:mode",
  default: modes.none,
});

export const useCanvasMode = () => {
  const [canvasMode, setCanvasMode] = useRecoilState(canvasModeState);

  return { canvasMode, setCanvasMode };
};
