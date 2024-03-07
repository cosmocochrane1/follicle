import { GenericAvatar } from "../GenericAvatar";
import {
  utcToLocalCalendarDate,
  utcDatesAreSameLocalDay,
  utcToLocalTime,
  timeDiffIsGreaterThanXMinutes,
} from "@/lib/utils";
import ChatMessageDateHeading from "./ChatMessageDateHeading";

export default function ChatMessage({ message, pvMessage }) {
  console.log(message);
  return (
    <>
      {/* IF No prev message or message date is not the same as prev */}
      {/* Display Date */}
      {(!pvMessage ||
        !utcDatesAreSameLocalDay(message.created_at, pvMessage.created_at)) && (
        <ChatMessageDateHeading>
          {utcToLocalCalendarDate(message.created_at)}
        </ChatMessageDateHeading>
      )}

      {/* IF (NO pv message OR new sender OR 5+ minute delay) */}
      {/* Display Avatar and Time above message */}
      {!pvMessage ||
      pvMessage.sender_id != message.sender_id ||
      timeDiffIsGreaterThanXMinutes(
        message.created_at,
        pvMessage.created_at,
        5
      ) ? (
        <div className="pt-3 text-sm px-4 w-full">
          <div className="flex overflow-hidden">
            <GenericAvatar
              src={message.sender.avatar_url}
              email={
                message.sender.username ||
                message.sender.full_name ||
                message.sender.email ||
                "fallback"
              }
              className="w-[32px] mr-[8px] flex-shrink-0"
            />
            <div className="flex flex-col flex-grow min-w-0">
              <div className="w-full flex justify-between">
                <p className="font-medium truncate flex-grow">
                  {message.sender.username ||
                    message.sender.full_name ||
                    message.sender.email}
                </p>
                <p className="font-light text-xs whitespace-nowrap">
                  {utcToLocalTime(message.created_at)}
                </p>
              </div>
              <div className="text-xs overflow-hidden truncate pt-1">
                {message.type === "text" && message.content}
                {/* TODO: support other message types: images audio etc. */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ELSE Display message content only
        <div className="pt-1 text-sm px-4">
          <div className="flex">
            <div className="w-[32px] flex-shrink-0 flex-grow-0 mr-[8px]" />
            <div className="flex flex-col">
              <div className="text-xs">
                {message.type === "text" && message.content}
                {/* TODO: support other message types: images audio etc. */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
