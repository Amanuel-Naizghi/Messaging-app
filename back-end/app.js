const express = require('express');
const app = express();
const session = require("express-session");
const path = require('node:path');
const http = require('http');
const { Server } = require("socket.io");

const passport = require("passport");
require("./config/passport")(passport);
const flash = require("connect-flash");

app.use(session({
    secret:"super-secret-key",
    resave:false,
    saveUninitialized:false
}))

const router = require('./router/userRouter');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    next();
});

const PORT = 3000
// Socket
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.set("io", io);

const socketHandler = require("./socket/socket");
socketHandler(io);

app.use('/', router);

server.listen(PORT, () => {
    console.log("Server running")
});



