const onlineUsers = new Map(); // userId -> socketId

module.exports = (io) => {
  io.on("connection", (socket) => {

    // Register user
    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      //The code below adds loged in user to onlineUsers for showing active users
      // console.log("OnlineUsers:", Array.from(onlineUsers.keys()));
      io.emit(
        "online_users",
        Array.from(onlineUsers.keys())
      );
      
    });

    // Disconnect
    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          //The code below implements logic for removing user after logout (inactive)
          onlineUsers.delete(userId);
          io.emit(
            "online_users",
            Array.from(onlineUsers.keys())
          );
          break;
        }
      }
      
    });

    socket.on("join_chat", (chatId) => {
        socket.join(`chat_${chatId}`);
    });
  });
};