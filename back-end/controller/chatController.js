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