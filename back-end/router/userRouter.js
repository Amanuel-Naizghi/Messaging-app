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
    res.render('login');//Soon to be replaced with our front end react page
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    if (!user) {
      return res.status(401).json({ 
        message: info?.message || "Invalid credentials" 
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Login failed" });
      }

      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email
        },
        chats: chatController.getUserChats(user.id)
      });
    });

  })(req, res, next);
});

router.get('/chats',ensureAuthenticated, chatController.getUserChats);//We used /chats as an API call for getting all messages by a user
router.post('/chats',ensureAuthenticated, chatController.createChat);// For creating a new conversations for a group or 1 to 1
router.post('/chats/:chatId/messages',ensureAuthenticated, chatController.sendMessage);//For sending a new message

module.exports = router;
