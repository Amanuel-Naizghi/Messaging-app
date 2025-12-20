const {PrismaClient} = require('./generated/prisma');

const prisma = new PrismaClient();

async function main() {
    // const newUser = await prisma.user.create({
    //     data: {
    //         userName : 'Moss',
    //         password: 'Moss123$',
    //     },
    // });

    // console.log('Created user:',newUser);

    const foundUser = await prisma.user.findMany();

    // console.log('Found user:', foundUser);
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());

module.exports = prisma;