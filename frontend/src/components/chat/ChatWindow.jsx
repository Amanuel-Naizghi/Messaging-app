import MessageInput from "./MessageInput";

function ChatWindow({selectedChat, messages}) {

  if(!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Select a conversation
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col">

      <div className="h-[70px] border-b flex items-center px-5">

        <h2 className="font-bold text-xl">

          {selectedChat.isGroup
            ? selectedChat.groupName
            : selectedChat.members[0]?.username}

        </h2>

      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {messages.map((message) => (

          <div
            key={message.id}
            className="bg-white p-3 rounded-xl shadow w-fit max-w-[400px]"
          >
            {message.text}
          </div>

        ))}

      </div>

    </div>
  );
}

export default ChatWindow;
