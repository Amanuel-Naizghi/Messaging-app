import { useAuth } from "../../context/AuthContext";

function Sidebar({chats,selectedChat,setSelectedChat}) {
  const { user } = useAuth();

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

        {chats.map((chat) => {
            const otherMember = chat.members.find( member => member.id !== user.id);
            console.log("Current User:", user);
            console.log("Chat members:", chat.members);   
            console.log("Other members:", otherMember);          
                                
          return (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 cursor-pointer border-b hover:bg-gray-100 text-left
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
                  : otherMember?.username.charAt(0).toUpperCase()+otherMember?.username.slice(1)}

              </h3>

              <p className="text-sm text-gray-500 truncate">

                {chat.lastMessage
                  ? chat.lastMessage.text
                  : "No messages yet"}

              </p>

            </div>
          )
          

        })}

      </div>

    </div>
  );
}

export default Sidebar;