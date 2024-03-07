export default function ChatRoomMessagesListContainer({ children }) {
  return (
    <div className='flex-1 overflow-auto min-h-0 hide-scrollbar'>
      {children}
    </div>
  )
}
