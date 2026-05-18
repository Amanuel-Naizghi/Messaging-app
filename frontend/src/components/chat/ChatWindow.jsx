import MessageInput from "./MessageInput";

function ChatWindow() {
  return (
    <div className="flex-1 flex flex-col bg-gray-100">

      {/* Header */}
      <div className="h-[70px] bg-white border-b flex items-center px-5">
        <h2 className="font-bold text-xl">
          Mr A
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {/* Sender */}
        <div className="flex">
          <div className="bg-white p-3 rounded-xl max-w-[300px] shadow">
            Hello 👋
          </div>
        </div>

        {/* Current user */}
        <div className="flex justify-end">
          <div className="bg-blue-500 text-white p-3 rounded-xl max-w-[300px] shadow">
            Hi there!
          </div>
        </div>

      </div>

      <MessageInput />

    </div>
  );
}

export default ChatWindow;
