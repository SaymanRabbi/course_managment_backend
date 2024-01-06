const mongoose = require('mongoose');


const Note = new mongoose.Schema({
    description:{
        type:String,
        required:[true,'Please enter your description'],
        trim:true,
        maxlength:[500,'Your description cannot exceed 500 characters']
    },
    teacherID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    purchessUserId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
},{
    timestamps:true
});

module.exports = mongoose.model('Note',Note);