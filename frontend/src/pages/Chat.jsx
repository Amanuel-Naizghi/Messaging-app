import Sidebar from "../components/chat/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import { useEffect, useState } from "react";
import { getChats,getMessages } from "../services/authService";
import { sendMessage } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Chat() {

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);

    const { user } = useAuth();

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
            // console.log(response);
            setChats(response.data.chats || response);
        } catch(error) {
            console.log(error);
        }
    }

    const loadMessages = async (chatId) => {
        try {
            const response = await getMessages(chatId);
            // console.log(response);
            setMessages(response.data || []);
            // console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSendMessage = async(text) => {
        if(!selectedChat) return;

        try{

            const response = await sendMessage(selectedChat.id, text);

            const newMessage = {
                ...response.data,
                sender: {
                    id: user.id,
                    username: user.username
                }
            };

            setMessages(prev => [
                ...prev,
                newMessage
            ])
            console.log(response);
        } catch(error){
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
                onSend={handleSendMessage}
            />
        </div>
    );
}

export default Chat;