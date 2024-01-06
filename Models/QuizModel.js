const mongoose = require('mongoose');
const Quiz = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Please enter your quiz title'],
        trim:true,
        maxlength:[100,'Your title cannot exceed 100 characters']
    },
    teacherID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    purchessUserId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    questions:[{
        question:{type:String},
        answer:[{type:String}],
        correctAnswer:{type:String}
    }],
},{
    timestamps:true
});

module.exports = mongoose.model('Quiz',Quiz);