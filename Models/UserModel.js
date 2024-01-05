const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


exports.userSchema = new mongoose.Schema({
   name:{
       type:String,
       required:[true,'Please enter your name'],
       trim:true,
       maxlength:[30,'Your name cannot exceed 30 characters']
   },
   email:{
       type:String,
       required:[true,'Please enter your email'],
       trim:true,
       unique:true
   },

},{
    timestamps:true
});