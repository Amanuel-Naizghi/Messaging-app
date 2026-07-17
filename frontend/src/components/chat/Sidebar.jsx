import { useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfilePicture } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function Sidebar({chats,selectedChat,setSelectedChat,onNewChat,onlineUsers}) {
  const { user } = useAuth();
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const handleProfilePicture = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    try {

        const response = await updateProfilePicture(file);
        setUser(response.data);

    } catch (err) {

        console.error(err);

    }

  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  }



  return (
    <div className="w-[350px] border-r border-gray-300 bg-white">
      {/* This input is hiden one which is used for adding a profile image */}
      <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleProfilePicture}
      />

      <div className="flex items-center justify-between p-4 border-b">

          <div className="flex items-center gap-3">

              <div
                  className="w-12 h-12 rounded-full bg-gray-300 
                  flex items-center justify-center text-lg font-semibold 
                  cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
              >

                  {user?.profilePic ? (

                      <img
                          src={`http://localhost:3000${user.profilePic}`}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                          draggable={false}
                      />

                  ) : (

                      user?.username?.charAt(0).toUpperCase()

                  )}

              </div>
              

              <div>

                  <h3 className="font-semibold">
                      {user?.username?.charAt(0).toUpperCase()+user?.username?.slice(1)}
                  </h3>


              </div>

          </div>
          <button
              onClick={handleLogout} title="Logout" className="text-red-500 hover:text-red-600">
              Logout
          </button>

      </div>
      
      {/* Header */}
      <div className="p-4 border-b border-gray-300">
        <h2 className="text-2xl font-bold text-left">
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
            const isOnline = otherMember?onlineUsers.includes(otherMember.id):false;       
                                
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
              <div className="flex items-center gap-2">
                  {!chat.isGroup && (
                      <span className={isOnline ? "text-green-500" : "text-gray-400"}>
                          ●
                      </span>
                  )}

                  <div>
                    <h3 className="font-semibold ">
                  

                      {chat.isGroup
                        ? chat.groupName
                        : otherMember?.username.charAt(0).toUpperCase()+otherMember?.username.slice(1)}

                    </h3>
                    {!chat.isGroup && (
                        <p className={`text-xs ${isOnline ? "text-green-600" : "text-gray-500"}`}>
                            {isOnline ? "Online" : "Offline"}
                        </p>
                    )}

                    <p className="text-sm text-gray-500 truncate">

                      {chat.lastMessage
                        ? chat.lastMessage.text
                        : "No messages yet"}

                    </p>

                  </div>
              </div>   

          </div>
          )
          

        })}

      </div>
      <button onClick={onNewChat} className="bg-blue-500 text-white px-3 py-1 rounded-lg border-t-[2rem]">
          +
      </button>


    </div>
  );
}

export default Sidebar;