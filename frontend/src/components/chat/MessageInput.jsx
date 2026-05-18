import { IoSend } from "react-icons/io5";

function MessageInput() {
  return (
    <div className="bg-white p-4 border-t">

      <form className="flex items-center gap-3">

        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-3 outline-none"
        />

        <button
          className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600"
        >
          <IoSend size={20} />
        </button>

      </form>

    </div>
  );
}

export default MessageInput;