import MessageInput from "./MessageInput";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { editMessage } from "../../services/authService";


function ChatWindow({selectedChat, messages, setMessages, onSend}) {

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

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

  const handleEdit = (message) => {
    setEditingMessageId(message.id);
    setEditedText(message.text);
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedText("");
  }

  const handleSaveEdit = async () => {

      try {

          const response = await editMessage(
              editingMessageId,
              editedText
          );

          setMessages(prev =>
              prev.map(message =>

                  message.id === editingMessageId
                      ? response.data
                      : message

              )
          );

          setEditingMessageId(null);
          setEditedText("");

      } catch (err) {

          console.log(err);

      }

  };

  

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

                    <div className="flex items-center gap-2">

                        <button
                            onClick={() => handleEdit(message)}
                            className="text-sm hover:text-blue-600"
                        >
                            ✏️
                        </button>

                        <div
                            className="
                                bg-blue-500
                                text-white
                                p-3
                                rounded-xl
                                shadow
                            "
                        >

                            {editingMessageId === message.id ? (

                                <input
                                    value={editedText}
                                    onChange={(e) => setEditedText(e.target.value)}
                                    className="bg-white text-black rounded px-2 py-1 outline-none"
                                />

                            ) : (

                                <>
                                    {message.text}
                                    <p className="text-[11px] text-right mt-1 text-white">
                                        {formatTime(message.createdAt)}
                                    </p>
                                </>

                            )}

                        </div>

                        {editingMessageId === message.id && (

                            <>
                                <button className="text-green-600" onClick={handleSaveEdit}>
                                    ✔
                                </button>

                                <button
                                    onClick={handleCancelEdit}
                                    className="text-red-600"
                                >
                                    ✖
                                </button>
                            </>

                        )}

                    </div>

                )}

          </div>

              );

          })}
          <div ref={messagesEndRef}></div>
      </div>
      <MessageInput onSend={onSend}/>
    </div>
  );
}

export default ChatWindow;
