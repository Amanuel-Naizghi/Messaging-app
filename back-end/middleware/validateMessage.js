module.exports = (req, res, next) => {
    let { text } = req.body;
    
    if (text === undefined || text === null) {
        return res.status(400).json({ error: "Messgae is required"});
    }

    text = String(text);
    const trimmedText = text.trim();
    
    if (trimmedText.length === 0) {
        return res.status(400).json({ error: "Message cannot be empty"});
    }

    if (trimmedText.length > 1000) {
        return res.status(400).json({ error: "Message too long"});
    }

    req.body.text = trimmedText;

    next();
};