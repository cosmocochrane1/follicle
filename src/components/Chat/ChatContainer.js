export default function ChatContainer({ children }) {
  return (
    <div className="absolute bottom-0 top-28 w-full">
      <div className="relative flex flex-col justify-content-between h-full px-0 p-2">
        {children}
      </div>
    </div>
  );
}
