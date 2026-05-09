const onlineUsers = new Map(); // userId -> socketId

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Register user
    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("User registered:", userId);
    });

    // Disconnect
    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      
      console.log("User disconnected:", socket.id);
    });

    socket.on("join_chat", (chatId) => {
        socket.join(`chat_${chatId}`);
        console.log(`Socket ${socket.id} joined chat_${chatId}`);
    });
  });
};