function Sidebar({chats,selectedChat,setSelectedChat}) {

  return (
    <div className="w-[350px] border-r border-gray-300 bg-white">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-300">
        <h2 className="text-2xl font-bold">
          Messages
        </h2>
      </div>

      {/* Search */}
      <div className="p-3">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 rounded-lg border outline-none"
        />
      </div>

      {/* Conversations */}
       <div className="overflow-y-auto">

        {chats.map((chat) => (

          <div
            key={chat.id}
            onClick={() => setSelectedChat(chat)}
            className={`p-4 cursor-pointer border-b hover:bg-gray-100
              ${
                selectedChat?.id === chat.id
                  ? "bg-gray-100"
                  : ""
              }
            `}
          >

            <h3 className="font-semibold">

              {chat.isGroup
                ? chat.groupName
                : chat.members[0]?.username}

            </h3>

            <p className="text-sm text-gray-500 truncate">

              {chat.lastMessage
                ? chat.lastMessage.text
                : "No messages yet"}

            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Sidebar;