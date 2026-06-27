import { useEffect, useState } from "react";
import { getUsers, createPrivateChat, createGroupChat } from "../../services/authService";

function NewChatModal({ onClose, loadChats }) {

    const [ users, setUsers ] = useState([]);
    const [ chatType, setChatType ] = useState("private");
    const [ groupName, setGroupName ] = useState("");
    const [ selectedUsers, setSelectedUsers ] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await getUsers();
                
                setUsers(response.data || []);
            } catch (error) {
                console.log(error);
            }
        }

        loadUsers();
    }, []);

    const handleCreateChat = async (userId) => {

        try {

            await createPrivateChat(userId);
            await loadChats();
            onClose();
        } catch (error) {
            console.log(error);
        }

    };

    const handleCreateGroup = async () => {

        try {

            if (!groupName.trim()) {
                setErrorMessage("Please enter a group name.");
                return;
            }

            if (selectedUsers.length < 2) {
                setErrorMessage("Please enter a group name.");
                return;
            }

            await createGroupChat(
                groupName,
                selectedUsers
            );

            await loadChats();

            onClose();

        } catch (error) {

            console.log(error.response?.data);

        }

    };



    const toggleUser = (userId)  => {
        setSelectedUsers(prev => {
            if (prev.includes(userId)){
                return prev.filter(id => id!==userId);
            }
            return [...prev, userId];
        })
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            
            <div className="bg-white p-6 rounded-lg w-[400px] ">
                
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setChatType("private")}
                        className={`flex-1 p-2 rounded ${chatType === "private" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        Private
                    </button>

                    <button
                        onClick={() => setChatType("group")}
                        className={`flex-1 p-2 rounded ${chatType === "group" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        Group
                    </button>
                </div>
                <div className="space-y-2">
                    {
                        chatType === "private" &&(
                            users.map(user => (

                                <div key={user.id} 
                                    className=" p-3 border rounded cursor-pointer hover:bg-gray-100 "
                                    onClick={() => handleCreateChat(user.id)}
                                >
                                    {user.username}
                                </div>
                            )
                        )
                        
                    )}
                    {
                        chatType == "group" && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Group Name"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    className="w-full p-2 border rounded mb-3"
                                />

                                <div className="space-y-2">
                                    {users.map(user => (
                                        <div
                                            key={user.id}
                                            onClick={() => toggleUser(user.id)}
                                            className={`p-3 border rounded cursor-pointer ${
                                                selectedUsers.includes(user.id)
                                                    ? "bg-blue-500 text-white"
                                                    : "hover:bg-gray-100"
                                            }`}
                                        >
                                            {user.username}
                                        </div>
                                    ))}
                                </div>
                                {errorMessage !== "" && (
                                    <div className="mb-3 rounded border border-red-300 bg-red-100 p-2 text-center text-red-700">
                                        {errorMessage}
                                    </div>
                                )}
                                <button
                                    onClick={handleCreateGroup}
                                    className="w-full mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Create Group
                                </button>
                            </>
                        )
                    }
                </div>

                <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
                    Close
                </button>
            </div>
        </div>
    );
}

export {NewChatModal};