const express = require('express');
const app = express();
const session = require("express-session");
const path = require('node:path');

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
})

app.use('/', router);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Your app is running on port ${PORT}`);
})