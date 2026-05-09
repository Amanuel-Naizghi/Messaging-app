const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
    console.log("Connected to server");
    console.log("Socket Id:", socket.id);

    socket.emit("register",1);
    console.log("Register emitted");

    socket.emit("join_chat", 1);
    console.log("Join chat emitted");
});

socket.on("receive_message", (data) => {
    console.log("Realtime message recieved:")
    console.log(data);
});

socket.on("disconnect", () => {
    console.log("Disconnected");
});