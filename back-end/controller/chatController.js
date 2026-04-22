const prisma = require("../index");

exports.getUserChats = async (userId) =>{

    const chats = await prisma.chat.findMany({
        where:{
            members:{
                some:{
                    userId: userId
                }
            }
        },
        include:{
            members: true,
            messages:{
                orderBy:{ createdAt:"desc"},
                take:1
            }
        }
    })

    // res.json(chats);
    return chats;
}

exports.createPrivateChat = async (currentUserId,userId) => {
  // User can't chat with him self
  if (!userId || userId === currentUserId) {
    return { error: true,message: "Invalid user"};
  }

  try {
    const existingChat = await exports.findPrivateChat(currentUserId,userId);

    if(existingChat) { 
      return {error: false,data: existingChat};
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
    return {error: false,data: chat};

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