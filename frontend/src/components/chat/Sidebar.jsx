
import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfilePicture } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function Sidebar({ chats, selectedChat, setSelectedChat, onNewChat, onlineUsers }) {
  const { user, logoutUser, setUser } = useAuth();
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleProfilePicture = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const response = await updateProfilePicture(file);
      setUser(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      e.target.value = "";
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const filteredChats = chats.filter((chat) => {
    const otherMember = chat.members?.find(
      (member) => member.id !== user?.id
    );

    const chatName = chat.isGroup
      ? chat.groupName
      : otherMember?.username;

    return (chatName || "")
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  return (
    <div className="w-full md:w-[350px] md:min-w-[350px] h-full flex flex-col border-r border-gray-300 bg-white">

      {/* Hidden profile image input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleProfilePicture}
      />

      {/* User profile */}
      <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-200 shrink-0">

        <div className="flex items-center gap-3 min-w-0">

          <div
            className="w-12 h-12 shrink-0 rounded-full bg-gray-300
                       flex items-center justify-center text-lg font-semibold
                       cursor-pointer overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {user?.profilePic ? (
              <img
                src={`${API_URL}${user.profilePic}`}
                alt="Profile"
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              user?.username?.charAt(0).toUpperCase()
            )}
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {user?.username
                ? user.username.charAt(0).toUpperCase() +
                  user.username.slice(1)
                : ""}
            </h3>
          </div>

        </div>

        <button
          onClick={handleLogout}
          title="Logout"
          className="text-red-500 hover:text-red-600 text-sm shrink-0"
        >
          Logout
        </button>

      </div>

      {/* Header */}
      <div className="px-4 pt-5 pb-3 shrink-0">
        <h2 className="text-2xl font-bold text-left text-gray-900">
          Messages
        </h2>
      </div>

      {/* Search */}
      <div className="px-4 pb-3 shrink-0">
        <input
          type="text"
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300
                     outline-none focus:border-blue-500
                     text-gray-900 bg-white"
        />
      </div>

      {/* Conversations */}
      <div className="flex-1 min-h-0 overflow-y-auto pb-20">

        {filteredChats.map((chat) => {
          const otherMember = chat.members?.find(
            (member) => member.id !== user?.id
          );

          const isOnline = otherMember
            ? onlineUsers.includes(otherMember.id)
            : false;

          const chatName = chat.isGroup
            ? chat.groupName
            : otherMember?.username;

          return (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`px-4 py-4 cursor-pointer border-b
                          border-gray-100 hover:bg-gray-100 text-left
                          ${
                            selectedChat?.id === chat.id
                              ? "bg-gray-100"
                              : ""
                          }`}
            >
              <div className="flex items-center gap-3 min-w-0">

                {/* Chat avatar */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-blue-100
                                  text-blue-600 flex items-center
                                  justify-center font-semibold text-lg">
                    {chatName?.charAt(0).toUpperCase() || "?"}
                  </div>

                  {!chat.isGroup && (
                    <span
                      className={`absolute bottom-0 right-0
                                  w-3.5 h-3.5 rounded-full
                                  border-2 border-white
                                  ${
                                    isOnline
                                      ? "bg-green-500"
                                      : "bg-gray-400"
                                  }`}
                    />
                  )}
                </div>

                {/* Chat information */}
                <div className="flex-1 min-w-0">

                  <h3 className="font-semibold text-gray-900 truncate">
                    {chatName
                      ? chatName.charAt(0).toUpperCase() + chatName.slice(1)
                      : "Unknown"}
                  </h3>

                  {!chat.isGroup && (
                    <p
                      className={`text-xs ${
                        isOnline ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {isOnline ? "Online" : "Offline"}
                    </p>
                  )}

                  <p className="text-sm text-gray-500 truncate mt-1">
                    {chat.lastMessage
                      ? chat.lastMessage.text
                      : "No messages yet"}
                  </p>

                </div>
              </div>
            </div>
          );
        })}

        {filteredChats.length === 0 && (
          <p className="text-center text-gray-500 text-sm mt-8">
            No conversations found
          </p>
        )}

      </div>

      {/* New chat button */}
      <div className="absolute md:relative bottom-6 right-5 md:bottom-auto md:right-auto md:p-4 pointer-events-none">
        <button
          onClick={onNewChat}
          title="New chat"
          className="pointer-events-auto w-14 h-14 md:w-12 md:h-12
                     bg-blue-500 hover:bg-blue-600 text-white
                     rounded-full shadow-lg flex items-center
                     justify-center text-3xl font-light"
        >
          +
        </button>
      </div>

    </div>
  );
}

export default Sidebar;
