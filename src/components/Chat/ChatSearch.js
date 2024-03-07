import LucideIcon from "../LucideIcon";
import { Input } from "../ui/input";

export default function ChatSearch({}) {
  // TODO Make this actually Search

  return (
    <div className="relative px-4">
      <LucideIcon
        name="search"
        className="absolute h-4 w-4 top-3 left-7 text-muted-foreground"
      />
      <Input
        // onChange={onChange}
        // value={value}
        placeholder="Search messages"
        className="mb-3 p-3 pl-10"
      />
    </div>
  );
}
