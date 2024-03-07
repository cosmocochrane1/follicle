export default function ChatMessageDateHeading({ children }) {
  return (
    <div className="flex items-center justify-center relative w-full my-2">
      <div className="w-full border-b absolute left-0 right-0 z-0" />
      <div className="bg-card rounded-full py-1 px-3 z-10 border">
        <h3 className="text-xs">{children}</h3>
      </div>
    </div>
  );
}
