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

router.post('/chats/private', ensureAuthenticated, async (req,res) => {
  const currentUserId = req.user.id;
  const {userId} = req.body;
  const result = await chatController.createPrivateChat(currentUserId,userId);

  if (!result.error ) {
    return res.status(200).json(result.data);
  } else{
    return res.status(400).json({error: result.message});
  }
});

module.exports = router;
