import MessageInput from "./MessageInput";
import { useAuth } from "../../context/AuthContext";

function ChatWindow({selectedChat, messages, onSend}) {

  const { user } = useAuth();
  const otherMember = selectedChat?.members?.find(
    member => member.id !== user.id
  );

  const formatTime = (dateString) => {

    return new Date(dateString)
           .toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
           });
  }

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
            : otherMember?.username.charAt(0).toUpperCase()+otherMember?.username.slice(1)}

        </h2>

      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">

        {messages.map((message) => {
          const isMine = message.senderId === user.id;

          return (
            <div
                key={message.id}
                className={`flex ${
                  isMine
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                {!isMine && (

                  <div className="flex gap-2 items-end">

                    <div
                      className="
                        w-8
                        h-8
                        rounded-full
                        bg-gray-300
                        flex
                        items-center
                        justify-center
                        text-sm
                        font-semibold
                      "
                    >
                      {message.sender.username
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>

                      <div className="bg-white p-3 rounded-xl shadow">
                        {message.text}
                        <p className="text-[11px] text-right mt-1 opacity-75">
                          {formatTime(message.createdAt)}
                        </p>
                      </div>

                    </div>

                  </div>

                )}

                {isMine && (

                  <div>

                    <div
                      className="
                        bg-blue-500
                        text-white
                        p-3
                        rounded-xl
                        shadow
                      "
                    >
                      {message.text}
                      <p className="text-[11px] text-right mt-1 text-white">
                        {formatTime(message.createdAt)}
                      </p>
                    </div>

                  </div>

                )}

          </div>

              );

          })}

      </div>
      <MessageInput onSend={onSend}/>
    </div>
  );
}

export default ChatWindow;
