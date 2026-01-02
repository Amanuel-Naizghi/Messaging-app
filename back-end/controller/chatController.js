const prisma = require("../index");

exports.getUserChats = async (req,res) =>{
    const userId = req.user.id;

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

    res.json(chats);
}

exports.createChat = async (req,res) => {
    const userId = req.user.id;
    const {membersIds} = req.body;

    if(!Array.isArray(membersIds) || membersIds.length === 0){
        return res.status(400).json({error:"messageId required"});
    }

    try{
        const chat = await prisma.chat.create({
            data: {
                members: {
                    create: [
                        {userId},
                        ...membersIds.map(id => ({userId:id}))
                    ]
                }
            }
        });

        res.status(201).json(chat);
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.sendMessage = async (req,res) => {
    const userId = req.user.id;
    const {content} = req.body;
    const {chatId} = req.params;

    const isMember = await prisma.chatMember.findFirst({
        where:{chatId:Number(chatId), userId}
    })
    
    if(!isMember){
        return res.status(403).json({error: "Not a member"})
    }

    const message = await prisma.message.create({
        data: {
            chatId:Number(chatId),
            senderId:userId,
            content
        }
    });

    res.status(201).json(message);
}