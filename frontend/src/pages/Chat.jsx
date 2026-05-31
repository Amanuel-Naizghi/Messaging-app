import Sidebar from "../components/chat/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import { useEffect, useState } from "react";
import { getChats } from "../services/authService";

function Chat() {

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        loadChats();
    },[]);

    const loadChats = async() => {
        try {
            const response = await getChats();
            console.log(response);
            setChats(response.data || response);
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <div className="h-screen flex overflow-hidden">
            <Sidebar 
                chats={chats}
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
            />
            <ChatWindow 
                selectedChat={selectedChat}
            />
        </div>
    );
}

export default Chat;