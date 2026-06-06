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