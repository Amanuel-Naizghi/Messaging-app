
import { IoSend } from "react-icons/io5";
import { useState } from "react";

function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  return (
    <div className="bg-white px-3 py-3 md:p-4 pb-[max(12px,env(safe-area-inset-bottom))]">

      <form
        className="flex items-center gap-2 md:gap-3 min-w-0"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          enterKeyHint="send"
          autoComplete="off"
          className="flex-1 min-w-0 border border-gray-300
                     rounded-full px-4 py-3
                     text-base text-gray-900 bg-white
                     outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Send message"
          className="w-11 h-11 md:w-12 md:h-12
                     shrink-0 flex items-center justify-center
                     bg-blue-500 text-white rounded-full
                     hover:bg-blue-600
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
        >
          <IoSend size={20} />
        </button>

      </form>

    </div>
  );
}

export default MessageInput;
