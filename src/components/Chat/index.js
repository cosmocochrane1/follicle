import ChatContainer from "./ChatContainer";
import ChatSearch from "./ChatSearch";
import ChatInput from "./ChatInput";
import ChatRoomMessagesListContainer from "./ChatRoomMessagesListContainer";
import ChatMessageList from "./ChatMessageList";
import { useChatroom } from "@/lib/hooks/useChatroom";
import { useRef } from "react";

export default function Chat({}) {
  /** TODO outstanding
   * - Implement Paginated fetching of older messages (with infinite scroll ui)
   * - Implement Search Messages
   * - Add migrations for
   *    - Updating messages table to allow realtime
   *        - ref: https://github.com/orgs/supabase/discussions/13680
   *    - Add users to document and projects chats if they are added to an organization?
   *    - Remove users from document and projects chats if they are removed from an organization?
   * - Implement Reactions and Replies
   */
  const { chatroom, liveMessages, isLoading, error } = useChatroom();
  const scrollToEndRef = useRef(null);

  if (error) {
    return <ChatServerError />;
  }

  return (
    <ChatContainer>
      <ChatSearch />
      <ChatRoomMessagesListContainer>
        <ChatMessageList
          scrollToEndRef={scrollToEndRef}
          chatroom={chatroom}
          isLoading={isLoading}
          liveMessages={liveMessages}
        />
      </ChatRoomMessagesListContainer>
      <ChatInput chatroomId={chatroom?.id} scrollToEndRef={scrollToEndRef} />
    </ChatContainer>
  );
}
