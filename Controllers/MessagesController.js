const Messages = require('../Models/MessagesModel');

exports.addMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;

    const message = new Messages({
        chatId,
        senderId,
        text
    });
    try {
        const result = await message.save();

        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json(err);
    }
}

exports.getMessages = async (req, res) => {
    try {
        const result = await Messages.find({ chatId: req.params.chatId });

        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json(err);
    }
}