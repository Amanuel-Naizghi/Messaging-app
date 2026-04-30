exports.formatedChats = (chats) => {
    return chats.map(chat => {
        const lastMessage = chat.messages[0] || null;

        return {
            id: chat.id,
            isGroup: chat.isGroup,
            groupName: chat.groupName,

            members: chat.members.map(m => m.user),

            lastMessage: lastMessage 
                ? {
                    text: lastMessage.text,
                    sender: lastMessage.sender.username,
                    createdAt: lastMessage.createdAt
                }
                : null,

            unreadCount: chat.unreadCount || 0
        };
    });

} 