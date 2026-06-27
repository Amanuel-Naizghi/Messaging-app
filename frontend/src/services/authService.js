import API from "../api/axios";

export const loginUser = async (userData) => {
    const response = await API.post("/login", userData);
    return response.data;
}

export const registerUser = async (userData) => {
    const response = await API.post("/createAccount", userData);
    return response.data;
}

export const getChats = async (userData) => {
    const response = await API.get("/chats");
    return response.data;
}

export const getMessages = async (chatId) => {
    const response = await API.get(`/messages/${chatId}`);
    return response.data;
}

export const sendMessage = async (chatId, text) => {
    const response = await API.post(
        "/messages",
        {
            chatId,
            text
        }
    );
    return response.data;
}

export const getUsers = async () => {
    const response = await API.get(
        "/users",
        {
            withCredentials: true
        }
    );
    return response.data;

};

export const createPrivateChat = async (userId) => {

    const response = await API.post(
        "/chats/private",
        { userId },
        { withCredentials: true }
    );

    return response.data;
};

export const createGroupChat = async (name, users) => {
    const response = await API.post(
        "/chats/group",
        {
            name,
            users
        },
        {
            withCredentials: true
        }
    );

    return response.data;
}