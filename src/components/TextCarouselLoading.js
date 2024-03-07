import React, { useState, useEffect } from "react";
import LucideIcon from "./LucideIcon";

const defaultMessages = [
  "Analyzing PDF...",
  "Processing pages...",
  "Segmenting content...",
  "Extracting sections...",
  "Refining layout...",
  "Organizing data...",
  "Splitting document...",
  "Optimizing PDF...",
  "Preparing analysis...",
  "Dividing sections...",
  "Classifying content...",
  "Enhancing text...",
  "Structuring PDF...",
  "Detailing segments...",
  "Customizing split...",
];

const TextCarouselLoading = ({ messages = defaultMessages }) => {
  const [message, setMessage] = useState(messages[0]);
  const [index, setIndex] = useState(0);
  const [animationStage, setAnimationStage] = useState("entering"); // 'entering', 'visible', 'exiting'

  useEffect(() => {
    const interval = setInterval(() => {
      if (animationStage === "visible") {
        // Start exiting animation
        setAnimationStage("exiting");
      }
    }, 4444); // Time for the text to stay visible

    return () => clearInterval(interval);
  }, [animationStage]);

  useEffect(() => {
    let timeout;
    if (animationStage === "exiting") {
      timeout = setTimeout(() => {
        // Change message and start entering animation
        setIndex((prevIndex) => (prevIndex + 1) % messages.length);
        setMessage(messages[index]);
        setAnimationStage("entering");
      }, 444); // Duration of exiting animation
    } else if (animationStage === "entering") {
      timeout = setTimeout(() => {
        // Change to visible stage
        setAnimationStage("visible");
      }, 444); // Duration of entering animation
    }

    return () => clearTimeout(timeout);
  }, [animationStage, index]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className={`flex items-center justify-center transition-all duration-500 ease-in-out transform ${
          animationStage === "entering"
            ? "-translate-y-10 opacity-0"
            : animationStage === "visible"
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }`}
      >
        <LucideIcon
          name="loader-2"
          className="h-4 w-4 animate-spin stroke-primary"
        />
        <div className="w-2" />
        {message}
      </div>
    </div>
  );
};

export default TextCarouselLoading;
