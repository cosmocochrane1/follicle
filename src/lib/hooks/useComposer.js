// useCamera.js
import { atom, useRecoilState } from "recoil";

export const composerPositionState = atom({
  key: "composer:position",
  default: { x: 0, y: 0 },
});
export const composerOpenState = atom({
  key: "composer:open",
  default: false,
});

export const useComposer = () => {
  const [composerPosition, setComposerPositon] = useRecoilState(
    composerPositionState
  );
  const [composerOpen, setComposerOpen] = useRecoilState(composerOpenState);

  return {
    composerPosition,
    setComposerPositon,
    composerOpen,
    setComposerOpen,
  };
};
