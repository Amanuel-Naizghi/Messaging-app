const prisma = require("../index");

exports.getUserChats = async (userId) => {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        members: {
          some: {
            userId: userId
          }
        }
      },
      include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              profilePic: true
            }
          }
        }
      },
      messages: { // This part is used for getting the latest message
        orderBy: { createdAt: "desc" },
        take: 1
      }
    },
    orderBy: { // Arranges the chats by decreasing order
      updatedAt: "desc"
    }
  });

    return {error: false,chats};
  } catch (err) {
    console.error(err);
    return {error: true, message: "Error fetching chats",status:500}
  }
}

exports.createPrivateChat = async (currentUserId,userId) => {
  // User can't chat with him self
  if (!userId || userId === currentUserId) {
    return { error: true,message: "Invalid user"};
  }

  try {
    const existingChat = await exports.findPrivateChat(currentUserId,userId);

    if(existingChat) { 
      return {error: false,data: existingChat, isNew:false };
    }

    const chat = await prisma.chat.create({
      data: {
        isGroup: false,
        members: {
          create: [
            { userId: currentUserId},
            { userId }
          ]
        }
      },
      include: {
        members: true
      }
    });
    return {error: false,data: chat, isNew: true };

  } catch (err){
    console.error(err);
    return {error: true,message: "Error creating chat"};
  }
};

exports.findPrivateChat = async (user1, user2) => {
  const chats = await prisma.chat.findMany({
    where: {
      isGroup: false,
      members: {
        some: {
          userId: { in: [user1, user2]}
        }
      }
    },
    include: {
      members: true
    }
  });
  // This part of the code is returning chats that only includes user1 and user2
  return chats.find(chat => {
    const userIds = chat.members.map(m => m.userId);
    return (userIds.length === 2 &&
            userIds.includes(user1) &&
            userIds.includes(user2)
    )
  })
}

exports.createGroupChat = async (currentUserId, name, users) => {
  // Inorder chats b/n groups to be created the users have to be >2
  if (!name || !users || users.length < 2){
    return {error: true, message: "Group must have a name and at least 2 users" };
  }

  try {
    const uniqueUsers = [... new Set(users)]; //We are removing duplicate users

    if (!uniqueUsers.includes(currentUserId)){
      uniqueUsers.push(currentUserId);
    }

    const foundUsers = await prisma.user.findMany({
      where: {
        id: {in: uniqueUsers}
      }
    });

    if (foundUsers.length !== uniqueUsers.length) {
      return {error: true, message: "One or more users not found" };
    }

    const chat = await prisma.chat.create({
      data: {
        isGroup: true,
        groupName: name,
        members: {
          create: uniqueUsers.map(id => ({
            userId: id
          }))
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
              id: true,
              username: true,
              email: true,
              profilePic: true
            }
            }
          }
        }
      }
    });

    return { error: false, data: chat};

  } catch (err) {
    console.error(err);
    return {error: true, message: "Error creating group chat"}
  }
}

