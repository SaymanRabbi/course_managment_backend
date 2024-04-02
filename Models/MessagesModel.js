const mongoose = require('mongoose');


const MessagesSchema = mongoose.Schema({
    chatId: {
        type: String
    },
    senderId: {
        type: String
    },
    text: {
        type: String
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Messages', MessagesSchema);
