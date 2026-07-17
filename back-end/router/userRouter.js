const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controller/userController');
const chatController = require('../controller/chatController');
const formater = require('../controller/formating');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const checkChatAccess = require('../middleware/checkChatAccess');
const validateMessage = require('../middleware/validateMessage');
const { success, error } = require('../utils/response');
const { message } = require('..');
const upload = require("../middleware/upload");




router.post('/createAccount', userController.postAddUser);


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

      return success(
        res,
        {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic
          },

          chats: formatedChatsResult
        },
          200
      );
    });

  })(req, res, next);
});

router.get('/chats', ensureAuthenticated, async (req,res) => {
  const userId = req.user.id;
  const result = await chatController.getUserChats(userId);
  const formatedChatsResult = formater.formatedChats(result.enrichedChats);

  if (!result.error) {
    return success(
      res,
      {
        user: {
          id: req.user.id,
          username: req.user.username,
          email: req.user.email,
          profilePic: req.user.profilePic
        },
        chats: formatedChatsResult
      },
      200
    );
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

router.post('/messages', ensureAuthenticated, checkChatAccess, validateMessage, async (req,res) => {
  const senderId = req.user.id;
  const { chatId, text } = req.body;

  const result = await chatController.createMessage(senderId, chatId, text);

  if(!result.error) {
    const io = req.app.get("io");
    io.to(`chat_${chatId}`).emit("receive_message", result.data);
    return success(res, result.data, result.status)
  } else {
    return error(res, result.message, result.status);
  }
});

router.get('/messages/:chatId', ensureAuthenticated, checkChatAccess, async (req, res) => {
  const userId = req.user.id;
  const chatId = parseInt(req.params.chatId);

  const { cursor, limit } = req.query;

  const result = await chatController.getChatDetailed(userId, chatId,cursor,limit);
  if(!result.error) {
    return success(res, result.data, 200);
  } else {
    return error(res, result.message, result.status);
  }
});

router.get('/users', ensureAuthenticated, async (req, res) => {
    const result = await chatController.getUsers(
      req.user.id
    );

    if (!result.error) {

      return success(res, result.data, 200);
    }

    return error(res, result.message, 500);
  }
);

router.put(
    "/profile-picture",
    ensureAuthenticated,
    upload.single("profilePic"),
    userController.updateProfilePicture
);

router.put(
    "/messages/:id", ensureAuthenticated, async (req, res) => {

        const senderId = req.user.id;

        const messageId = Number(req.params.id);

        const { text } = req.body;

        const result = await chatController.editMessage(
            senderId,
            messageId,
            text
        );

        if (!result.error) {
            return success(
                res,
                result.data,
                result.status
            );
        }

        return error(
            res,
            result.message,
            result.status
        );

    }
);

router.delete(
    "/messages/:id",
    ensureAuthenticated,
    async (req, res) => {

        const result = await chatController.deleteMessage(
            req.user.id,
            Number(req.params.id)
        );

        if (!result.error) {
            return success(res, result.data, result.status);
        }

        return error(res, result.message, result.status);

    }
);

router.post("/logout", (req,res) => {
  req.logout((err) => {
    if (err) {
      return error(res,"Logout Failed", 500);
    }

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      return success(res,"Logged out");
    })
  })
});

module.exports = router;
