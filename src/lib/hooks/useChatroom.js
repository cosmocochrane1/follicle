import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useChatroom = () => {
  // STATE
  const [chatroom, setChatroom] = useState(null);
  const [profiles, setProfiles] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [liveMessages, setLiveMessages] = useState([]);

  // HOOKS
  // Get Query Params
  const searchParams = useSearchParams();
  const document_id = searchParams.get("document_id");
  const project_id = searchParams.get("project_id");

  // Get Chatroom.id and data
  useEffect(() => {
    setIsLoading(true);
    setError(false);

    if (!document_id && !project_id) {
      setError(true);
      return;
    }

    let url = "";
    if (document_id) {
      url = `/api/chatrooms?document_id=${document_id}`;
    } else if (project_id) {
      url = `/api/chatrooms?project_id=${project_id}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setChatroom(data.chatroom);
        setProfiles(data.profiles);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(true);
      });
  }, [document_id, project_id]);

  // Connect to supabase
  const supabase = useSupabaseClient();

  // Handle new messages
  const handleInserts = (payload) => {
    // Payload cannot join profile data
    // chatroom_profiles data stored in hash map for sender data
    const senderId = payload.new.id;
    // sender profile data is stored in state
    if (!!profiles?.[senderId]) {
      setLiveMessages((pv) => [
        ...pv,
        {
          ...payload.new,
          sender: { ...profiles[senderId] },
        },
      ]);
    } else {
      // sender profile data is NOT stored in state
      // fetch it and add it to profiles
      const url = `/api/chatrooms/messages/${payload.new.id}`;
      fetch(url)
        .then((res) => res.json())
        .then((newMessage) => {
          setLiveMessages((pv) => [...pv, newMessage]);
          setProfiles((pv) => ({
            ...pv,
            [newMessage.sender.id]: newMessage.sender,
          }));
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  // Subscribe to inserts on messages table where chatroomId
  useEffect(() => {
    if (chatroom?.id) {
      const subscription = supabase
        .channel(chatroom?.id)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `chatroom_id=eq.${chatroom?.id}`,
          },
          handleInserts
        )
        .subscribe();
      return () => {
        if (chatroom?.id) {
          subscription.unsubscribe();
        }
      };
    }
  }, [chatroom]);

  return {
    chatroom,
    profiles,
    liveMessages,
    isLoading,
    error,
  };
};
