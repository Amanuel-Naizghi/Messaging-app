import MessageInput from "./MessageInput";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { editMessage, deleteMessage } from "../../services/authService";


function ChatWindow({selectedChat, messages, setMessages, onSend, updateLastMessage}) {

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const messagesEndRef = useRef(null);
  const [menuMessageId, setMenuMessageId] = useState(null);

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

          updateLastMessage(response.data);
          setEditingMessageId(null);
          setEditedText("");

      } catch (err) {

          console.log(err);

      }

  };

  const handleDelete = async (messageId) => {

    try {

        await deleteMessage(messageId);

        setMessages(prev =>
            prev.filter(message =>
                message.id !== messageId
            )
        );

        setMenuMessageId(null);

        const remainingMessages = messages.filter(
            message => message.id !== messageId
        );


        const newLastMessage = remainingMessages.at(-1);

        if (newLastMessage) {
            updateLastMessage(newLastMessage);
        } else {
            updateLastMessage(null);
        }

        updateLastMessage(newLastMessage);

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

                      <div className="relative">
                          <button
                              onClick={() => setMenuMessageId(
                                  menuMessageId === message.id
                                      ? null
                                      : message.id
                              )}
                              className="text-gray-500 hover:text-black"
                          >
                              ⋮
                          </button>
                          {menuMessageId === message.id && (
                            <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg border">

                                <button
                                    onClick={() => {
                                        handleEdit(message);
                                        setMenuMessageId(null);
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                                >
                                    ✏ Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(message.id)}
                                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
                                >
                                    🗑 Delete
                                </button>

                            </div>
                          )}
                      </div>

                        

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
