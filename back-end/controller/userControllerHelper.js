// userControllerHelper.js
const prisma = require('../index');

const getUser = async (name) => {
    const user = await prisma.user.findFirst({ 
        where: { username: name }
    });
    return user;
}

const getUserByEmail = async (email) => {
    const user = await prisma.user.findFirst({
        where:{email}
    })

    return user;
}

const getUserById = async (id) => {
    const user = await prisma.user.findFirst({ 
        where: { id }
    });
    return user;
}

module.exports ={getUser, getUserByEmail,getUserById}