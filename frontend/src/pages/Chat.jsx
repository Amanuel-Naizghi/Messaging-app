import Sidebar from "../components/chat/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import { useEffect, useState } from "react";
import { getChats,getMessages } from "../services/authService";

function Chat() {

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        loadChats();
    },[]);

    useEffect(() => {
        if (!selectedChat) return;
        loadMessages(selectedChat.id);
    },[selectedChat]);

    const loadChats = async() => {
        try {
            const response = await getChats();
            console.log(response);
            setChats(response.data || response);
        } catch(error) {
            console.log(error);
        }
    }

    const loadMessages = async (chatId) => {
        try {
            const response = await getMessages(chatId);
            // console.log(response);
            setMessages(response.data || []);
            console.log(response.data);
        } catch (error) {
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
                messages={messages}
            />
        </div>
    );
}

export default Chat;