
import MessageInput from "./MessageInput";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { editMessage, deleteMessage } from "../../services/authService";

function ChatWindow({
  selectedChat,
  messages,
  setMessages,
  onSend,
  updateLastMessage,
  onBack
}) {

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const messagesEndRef = useRef(null);
  const [menuMessageId, setMenuMessageId] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  const otherMember = selectedChat?.members?.find(
    member => member.id !== user?.id
  );

  const chatName = selectedChat?.isGroup
    ? selectedChat.groupName
    : otherMember?.username;

  const displayName = chatName
    ? chatName.charAt(0).toUpperCase() + chatName.slice(1)
    : "Conversation";

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEdit = (message) => {
    setEditingMessageId(message.id);
    setEditedText(message.text);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedText("");
  };

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
      console.error(err);
    }
  };

  const handleDelete = async (messageId) => {
    try {
      await deleteMessage(messageId);

      const remainingMessages = messages.filter(
        message => message.id !== messageId
      );

      setMessages(remainingMessages);
      setMenuMessageId(null);

      const newLastMessage = remainingMessages.at(-1) || null;
      updateLastMessage(newLastMessage);

    } catch (err) {
      console.error(err);
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a conversation
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 min-h-0 flex flex-col bg-gray-50">

      {/* Chat Header */}
      <div className="h-[65px] md:h-[70px] shrink-0 border-b border-gray-200 bg-white flex items-center gap-3 px-3 md:px-5">

        {/* Mobile back button */}
        <button
          onClick={onBack}
          className="md:hidden flex items-center justify-center w-10 h-10 shrink-0 text-gray-700 hover:bg-gray-100 rounded-full"
          aria-label="Back to conversations"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {/* Chat avatar */}
        <div className="w-10 h-10 shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
          {displayName.charAt(0).toUpperCase()}
        </div>

        {/* Chat name */}
        <div className="min-w-0 flex-1">
          <h2 className="font-bold text-base md:text-xl text-gray-900 truncate">
            {displayName}
          </h2>
          {selectedChat.isGroup && (
            <p className="text-xs text-gray-500">
              Group conversation
            </p>
          )}
        </div>

      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 md:p-5 space-y-4">

        {messages.map((message) => {
          const isMine = message.senderId === user?.id;

          return (
            <div
              key={message.id}
              className={`flex min-w-0 ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >

              {/* Received messages */}
              {!isMine && (
                <div className="flex gap-2 items-end max-w-[90%] md:max-w-[75%] min-w-0">

                  <div className="w-8 h-8 shrink-0 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                    {message.sender?.username?.charAt(0).toUpperCase() || "?"}
                  </div>

                  <div className="min-w-0">
                    <div className="bg-white text-gray-900 p-3 rounded-xl shadow-sm break-words [overflow-wrap:anywhere]">
                      <p className="whitespace-pre-wrap">
                        {message.text}
                      </p>
                      <p className="text-[11px] text-right mt-1 text-gray-500">
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* Sent messages */}
              {isMine && (
                <div className="flex items-center justify-end gap-2 max-w-[90%] md:max-w-[75%] min-w-0">

                  {/* Edit/Delete menu */}
                  <div className="relative shrink-0">
                    <button
                      onClick={() =>
                        setMenuMessageId(
                          menuMessageId === message.id
                            ? null
                            : message.id
                        )
                      }
                      className="w-8 h-10 text-gray-500 hover:text-black text-xl"
                      aria-label="Message options"
                    >
                      ⋮
                    </button>

                    {menuMessageId === message.id && (
                      <div className="absolute right-0 bottom-full mb-2 z-20 w-32 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">

                        <button
                          onClick={() => {
                            handleEdit(message);
                            setMenuMessageId(null);
                          }}
                          className="w-full text-left px-3 py-2 text-gray-800 hover:bg-gray-100"
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

                  {/* Message bubble */}
                  <div className="min-w-0 bg-blue-500 text-white p-3 rounded-xl shadow-sm break-words [overflow-wrap:anywhere]">

                    {editingMessageId === message.id ? (
                      <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        rows={2}
                        className="w-full min-w-[120px] max-w-full bg-white text-gray-900 rounded px-2 py-1 outline-none resize-none"
                      />
                    ) : (
                      <>
                        <p className="whitespace-pre-wrap">
                          {message.text}
                        </p>
                        <p className="text-[11px] text-right mt-1 text-blue-100">
                          {formatTime(message.createdAt)}
                        </p>
                      </>
                    )}

                  </div>

                  {/* Save / Cancel */}
                  {editingMessageId === message.id && (
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        className="text-green-600"
                        onClick={handleSaveEdit}
                        aria-label="Save edit"
                      >
                        ✔
                      </button>

                      <button
                        onClick={handleCancelEdit}
                        className="text-red-600"
                        aria-label="Cancel edit"
                      >
                        ✖
                      </button>
                    </div>
                  )}

                </div>
              )}

            </div>
          );
        })}

        <div ref={messagesEndRef}></div>
      </div>

      {/* Message Input */}
      <div className="shrink-0 bg-white border-t border-gray-200">
        <MessageInput onSend={onSend} />
      </div>

    </div>
  );
}

export default ChatWindow;
