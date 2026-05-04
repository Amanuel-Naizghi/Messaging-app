const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controller/userController');
const chatController = require('../controller/chatController');
const formater = require('../controller/formating');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const { success, error } = require('../utils/response');
const { message } = require('..');



router.get('/',(req,res) => {
    res.render('test');
});

router.post('/createAccount', userController.postAddUser);

router.get('/login',(req,res) => {
    res.render('login');//Soon to be replaced with our front end react page
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    
    if (err) {
      return error(res, "Server error", 500)
    }

    if (!user) {
      const message = info?.message || "Invalid credentials";
      return error(res, message, 401);
    }

    req.logIn(user, async (err) => {
      if (err) {
        return error(res,"Login failed", 401)
      }
      const chatsResult = await chatController.getUserChats(user.id);
      const formatedChatsResult = formater.formatedChats(chatsResult.enrichedChats);

      return success(res,formatedChatsResult, 200);
    });

  })(req, res, next);
});

router.get('/chats', ensureAuthenticated, async (req,res) => {
  const userId = req.user.id;
  const result = await chatController.getUserChats(userId);
  const formatedChatsResult = formater.formatedChats(chatsResult.enrichedChats);

  if (!result.error) {
    return success(res, formatedChatsResult, 200)
  } else {
    return error(res, "Invalid credentials", 401)
  }
});

router.post('/chats/private', ensureAuthenticated, async (req,res) => {
  const currentUserId = req.user.id;
  const {userId} = req.body;
  const result = await chatController.createPrivateChat(currentUserId,userId);

  if (!result.error ) {
    const statusId = result.isNew ? 201:200;
    return success(res, result.data, statusId);
  } else{
    return error(res, result.message, 400);
  }
});

router.post('/chats/group', ensureAuthenticated, async (req,res) => {
  const currentUserId = req.user.id;
  const { name, users } = req.body;

  const result = await chatController.createGroupChat(currentUserId, name, users);

  if(!result.error) {
    const statusId = result.isNew ? 201:200;
    return success(res, result.data, statusId);
  } else {
    return error(res, result.message, 400);
  }
});

router.post('/messages', ensureAuthenticated, async (req,res) => {
  const senderId = req.user.id;
  const { chatId, text } = req.body;

  const result = await chatController.createMessage(senderId, chatId, text);

  if(!result.error) {
    return success(res, result.data, result.status)
  } else {
    return error(res, result.message, result.status);
  }
});

router.get('/messages/:chatId', ensureAuthenticated, async (req, res) => {
  const userId = req.user.id;
  const chatId = parseInt(req.params.chatId);

  const { cursor, limit } = req.query;

  const result = await chatController.getChatDetailed(userId, chatId,cursor,limit);
  if(!result.error) {
    return success(res, result.data, 200);
  } else {
    return error(res, result.message, result.status);
  }
})

module.exports = router;
