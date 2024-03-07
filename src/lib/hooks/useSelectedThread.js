// useSelectedThread.js
import { atom, useRecoilState } from "recoil";

export const selectedThreadState = atom({
  key: "thread:selected",
  default: null,
});

export const useSelectedThread = () => {
  const [selectedThread, setSelectedThread] =
    useRecoilState(selectedThreadState);

  return {
    selectedThread,
    setSelectedThread,
  };
};
