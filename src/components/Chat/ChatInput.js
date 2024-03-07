import { useEffect, useState } from "react";
import useCreateChatroomMessage from "@/lib/hooks/actions/useCreateChatroomMessage";
import { useToast } from "../ui/use-toast";
import { Input } from "../ui/input";
import { ArrowUpCircle } from "lucide-react";

export default function ChatInput({ chatroomId, scrollToEndRef }) {
  // Hooks
  const { createMessage, error, isLoading } = useCreateChatroomMessage();
  const { toast } = useToast();

  // State
  const [value, setValue] = useState("");

  // Handlers
  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onClickAndFocus = () => {
    if (scrollToEndRef.current) {
      scrollToEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!chatroomId || !value || value.trim().length === 0 || isLoading) {
      return;
    }
    try {
      setValue("");
      const response = await createMessage({
        content: value,
        chatroom_id: chatroomId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // EFfects
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  }, [error]);

  return (
    <form onSubmit={onSubmit} className="px-4">
      {value.trim().length > 0 && (
        <button
          className="absolute m-5 right-0 px-3"
          type="submit"
          disabled={!chatroomId || isLoading}
        >
          <ArrowUpCircle className={"pl-3 w-full"} />
        </button>
      )}
      <Input
        onChange={onChange}
        onFocus={onClickAndFocus}
        onClick={onClickAndFocus}
        value={value}
        placeholder="Type Your Message"
        className="my-3 p-3 pr-10"
      />
    </form>
  );
}
