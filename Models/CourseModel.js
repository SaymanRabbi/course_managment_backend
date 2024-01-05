const mongoose = require('mongoose');

const Course = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Please enter your title'],
        trim:true,
        maxlength:[100,'Your title cannot exceed 100 characters']
    },
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
    }],
    modules:[{
        title:{type:String},
        lessons:[{
            title:{type:String},
            video:{type:String},
            content:{type:String}
        }]
    }],
},{
    timestamps:true
});

module.exports = mongoose.model('Course',Course);