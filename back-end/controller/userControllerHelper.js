// userControllerHelper.js
const prisma = require('../index');

const getUser = async (name) => {
    const user = await prisma.user.findFirst({ 
        where: { username: name }
    });
    return user;
}

module.exports ={getUser}