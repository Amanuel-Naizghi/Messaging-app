import Sidebar from "../components/chat/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";

function Chat() {
    return (
        <div className="h-screen flex overflow-hidden">
            <Sidebar />
            <ChatWindow />
        </div>
    );
}

export default Chat;