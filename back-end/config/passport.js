const passport = require("passport")
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");
const userControllerHelper = require('../controller/userControllerHelper');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy(
            { usernameField: 'email', passwordField: 'password' },
            async (email, password, done) => {
                try {
                    const user = await userControllerHelper.getUserByEmail(email);
                    console.log(`User email is ${email} and password is ${password}`);
                    if (!user) {
                        return done(null, false, { message: "Incorrect user name" });
                    }
                    const match = await bcrypt.compare(password, user.passwordHash);
                    if (!match) {
                        return done(null, false, { message: "Incorrect password" });
                    }
                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const rows = await userControllerHelper.getUserById(id);
            // console.log(`Rows :`, rows);
            done(null, rows);
        } catch (err) {
            done(err);
        }
    });
};