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

    req.logIn(user, async (err) => {
      if (err) {
        return res.status(500).json({ message: "Login failed" });
      }
      const chats = await chatController.getUserChats(user.id);
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email
        },
        chats
      });
    });

  })(req, res, next);
});

router.get('/chats', ensureAuthenticated, async (req,res) => {
  const userId = req.user.id;
  const result = await chatController.getUserChats(userId);

  if (!result.error) {
    return res.json(result.chats);
  } else {
    return res.status(result.status).json({error: result.message});
  }
});

router.post('/chats/private', ensureAuthenticated, async (req,res) => {
  const currentUserId = req.user.id;
  const {userId} = req.body;
  const result = await chatController.createPrivateChat(currentUserId,userId);

  if (!result.error ) {
    const statusId = result.isNew ? 201:200;
    return res.status(statusId).json(result.data);
  } else{
    return res.status(400).json({error: result.message});
  }
});

router.post('/chats/group', ensureAuthenticated, async (req,res) => {
  const currentUserId = req.user.id;
  const { name, users } = req.body;

  const result = await chatController.createGroupChat(currentUserId, name, users);

  if(!result.error){
    const statusId = result.isNew ? 201:200;
    return res.status(statusId).json(result.data);
  } else {
    return res.status(400).json({error: result.message});
  }
})

module.exports = router;
