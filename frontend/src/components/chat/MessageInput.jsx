import { IoSend } from "react-icons/io5";
import { useState } from "react";

function MessageInput({ onSend }) {
  const [text, setText] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if(!text.trim()) return;
    onSend(text);
    // console.log("I have been triggered")
    setText("");
  }
  return (
    <div className="bg-white p-4 border-t">

      <form className="flex items-center gap-3" onSubmit={handleSubmit}>

        <input
          type="text"
          onChange={(e) => setText(e.target.value)}
          value={text}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-3 outline-none"
        />

        <button
          className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600"
          type="submit"
        >
          <IoSend size={20} />
        </button>

      </form>

    </div>
  );
}

export default MessageInput;