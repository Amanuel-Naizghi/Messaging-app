const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controller/userController');
const chatController = require('../controller/chatController');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');



router.get('/',(req,res) =>{
    res.render('test');
});

router.post('/createAccount', userController.postAddUser);

router.get('/login',(req,res) => {
    res.render('login');
});

router.post('/login', 
                     passport.authenticate('local',{
                        successRedirect:'/success',
                        failureRedirect:'/login',
                        failureFlash:"Wrong user name or password"
                    }),                  
);

router.get('/success',ensureAuthenticated,(req,res) => {
    res.render('success');
})//Used just for testing purpose for login

router.get('/chats',ensureAuthenticated, chatController.getUserChats);//We used /chats as an API call for getting all messages by a user
router.post('/chats',ensureAuthenticated, chatController.createChat);// For creating a new conversations for a group or 1 to 1
router.post('/chats/:chatId/messages',ensureAuthenticated, chatController.sendMessage);//For sending a new message

module.exports = router;
