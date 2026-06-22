import Sidebar from "../components/chat/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import { useEffect, useState } from "react";
import { getChats,getMessages } from "../services/authService";
import { sendMessage } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { socket } from "../socket/socket";
import { NewChatModal } from "../components/chat/NewChatModal";

function Chat() {

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [showNewChat, setShowNewChat] = useState(false);

    const { user } = useAuth();

    const onNewChat = () => {
        console.log("New Chat created");
        setShowNewChat(true);
    }

    useEffect(() => {
        loadChats();
    },[]);

    useEffect(() => {
        if (!selectedChat) return;
        loadMessages(selectedChat.id);
    },[selectedChat]);

    useEffect(() => {

        if(!selectedChat) return;
        socket.emit(
            "join_chat",
            selectedChat.id
        );
    }, [selectedChat]);

    useEffect(() => {

        if (!user) return;

        const handleReceiveMessage = (message) => {

            // Ignore messages sent by the current user
            if (message.senderId === user.id) {
                return;
            }

            setMessages(prev => {

                const exists = prev.some(
                    msg => msg.id === message.id
                );

                if (exists) {
                    return prev;
                }

                return [
                    ...prev,
                    message
                ];

            });

        };

        socket.on(
            "receive_message",
            handleReceiveMessage
        );

        return () => {
            socket.off(
                "receive_message",
                handleReceiveMessage
            );
        };

    }, [user]);


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

        if (!selectedChat) return;

        try {

            const response = await sendMessage(
                selectedChat.id,
                text
            );

            const newMessage = {
                ...response.data,
                sender: {
                    id: user.id,
                    username: user.username
                }
            };
            console.log("Local ID:", newMessage.id);
            setMessages(prev => [
                ...prev,
                newMessage
            ]);

            setChats(prev =>
                prev.map(chat => {

                    if (chat.id !== selectedChat.id) {
                        return chat;
                    }

                    return {
                        ...chat,
                        lastMessage: {
                            text: newMessage.text,
                            sender: user.username,
                            createdAt: newMessage.createdAt
                        }
                    };

                })
            );

        } catch(error) {
            console.log(error);
        }
    };

    return (
        <div className="h-screen flex overflow-hidden">
            <Sidebar 
                chats={chats}
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                onNewChat={onNewChat}
            />
            <ChatWindow 
                selectedChat={selectedChat}
                messages={messages}
                onSend={handleSendMessage}
            />
            {showNewChat && (
                <NewChatModal onClose={()=> setShowNewChat(false)}
                              loadChats={loadChats}
                />
            )}
        </div>
    );
}

export default Chat;