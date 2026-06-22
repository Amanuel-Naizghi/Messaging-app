import { useEffect, useState } from "react";
import { getUsers, createPrivateChat } from "../../services/authService";

function NewChatModal({ onClose, loadChats }) {

    const [ users, setUsers ] = useState([]);

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

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div
                className="bg-white p-6 rounded-lg w-[400px] ">
                <div className="space-y-2">

                    {users.map(user => (

                        <div key={user.id} 
                             className=" p-3 border rounded cursor-pointer hover:bg-gray-100 "
                             onClick={() => handleCreateChat(user.id)}
                        >
                            {user.username}
                        </div>

                    ))}

                </div>

                <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded">
                    Close
                </button>
            </div>
        </div>
    );
}

export {NewChatModal};