import { useState } from "react";
import { mutate } from "swr";

const useCreateChatroomMessage = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const createMessage = async ({ type, content, chatroom_id }) => {
    setIsLoading(true);
    try {
      type = type || "text"; // <- default value
      const url = `/api/chatrooms/messages?chatroom_id=${chatroom_id}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, content, chatroom_id }),
      });

      if (!res.ok) {
        throw new Error("Failed to upload message.");
      }
      const data = await res.json();
      mutate(url);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createMessage,
    isLoading,
    error,
  };
};

export default useCreateChatroomMessage;
