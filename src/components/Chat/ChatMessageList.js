import ChatMessage from "./ChatMessage";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useMemo } from "react";
import ChatServerError from "./ChatServerError";
const skeletonArray = Array.from(Array(6).keys());

export default function ChatMessageList({
  scrollToEndRef,
  chatroom,
  isLoading,
  liveMessages,
}) {
  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!!chatroom || !!liveMessages?.length) {
      scrollToEndRef.current.scrollIntoView({
        behavior: "instant",
        block: "end",
        inline: "nearest",
      });
    }
  }, [scrollToEndRef, isLoading, chatroom, liveMessages]);

  const showEmptyState = useMemo(() => {
    return (
      !isLoading &&
      (!chatroom || chatroom.messages?.length === 0) &&
      (!liveMessages || liveMessages?.length === 0)
    );
  }, [isLoading, chatroom, chatroom?.messages, liveMessages]);

  if (!isLoading && !chatroom) {
    return <ChatServerError />;
  }

  return (
    <>
      {isLoading ? (
        <>
          {skeletonArray.map((n) => (
            <div className="px-4">
              <Skeleton className="w-full h-12 my-3" key={n} />
            </div>
          ))}
        </>
      ) : (
        <>
          {/* OLD MESSAGES GET */}
          {chatroom.messages.map((m, i) => (
            <ChatMessage
              key={m.id}
              message={m}
              pvMessage={chatroom.messages[i - 1] || null}
            />
          ))}

          {/* LIVE MESSAGE SUBSCRIBED */}
          {liveMessages.map((m, i) => (
            <ChatMessage
              key={m.id}
              message={m}
              pvMessage={
                liveMessages[i - 1] ||
                chatroom.messages[chatroom.messages.length - 1] ||
                null
              }
            />
          ))}
        </>
      )}
      {showEmptyState && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center px-4 pointer-events-none">
          <p className="text-foreground/70 leading-relaxed text-center">
            It seems like you don’t have any messages. Start a new conversation
            and see where it takes you.
          </p>
        </div>
      )}
      <div ref={scrollToEndRef} className="h-0 w-0" />
    </>
  );
}
