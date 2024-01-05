const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const colors = require('colors');

//------------------ Connect to mongodb ------------------//
exports.DBConnection= () =>{
     mongoose.connect(process.env.DB_URL).then(()=>{
        console.log(`Database connected successfully`.red.bold)
     })
}
//------------------ Connect to mongodb ------------------//