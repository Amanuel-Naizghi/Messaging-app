const prisma = require('../index');

module.exports = async (req, res, next) => {
    try {
        const userId = req.user.id;
        // getting chatId from either post or get request
        const chatId = parseInt(req.params.chatId || req.body.chatId);

        if(!chatId) {
            return res.status(400).json({
                success:false,
                error: "chatId is required"
            });
        }

        const member = await prisma.chatMember.findFirst({
            where: { chatId, userId}
        });

        if (!member) {
            return res.status(403).json({
                success:false,
                error: "Access denied"
            });
        }

        next();

    } catch (err){
        console.error(err);
        return res.status(500).json({
            success:false,
            error: "Authorization error"
        })
    }
}