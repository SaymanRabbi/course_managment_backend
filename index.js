const express = require('express');
const app = express();
const cors = require('cors');
const colors = require('colors');
const { DBConnection } = require('./utils/dataBase');
const { ErrorHandaler } = require('./Middlewares/ErrorHandaler');
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const dotenv = require('dotenv').config();

// socket.io
const io = require('socket.io')(8080, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }

});

let users = [];
io.on('connection', (socket) => {
   socket.on("addUser", userId => {
    const userExist = users.find(user => user.userId === userId);
    if(!userExist) {
        users.push({userId, socketId: socket.id});
        io.emit("getUsers", users)
    }
   });
   socket.on("sendMessage", ({senderId, receiverId, text,conversationId}) => {
    const receiver = users.find(user => user.userId === receiverId);
    const sender = users.find(user => user.userId === senderId);
    if(receiver) {
        io.to(receiver.socketId).to(sender.socketId).emit("getMessage", {
            senderId,
            text,
            conversationId
        })
    }
    
   });
  socket.on('disconnect', () => {
    users = users.filter(user => user.socketId !== socket.id);
    io.emit("getUsers", users);
  });
});


// http://localhost:5173/dashboard/message

const userRoute = require('./Routes/UserRoute');
const courseRoute = require('./Routes/CourseRoute');
// ------------------ Connect to Database ------------------//
DBConnection();
// ------------------ Connect to Database ------------------//
// ------------------ Middlewares ------------------//

// ------------------ Middlewares ------------------//
// ------------------ Routes ------------------//

// ------------------ Routes ------------------//
 app.use('/api/v1/user', userRoute);
 app.use('/api/v1/course', courseRoute);
// ------------------ Lisiting route ------------------//
app.listen(port, () => {
    console.log(`Server is running on port ${port}`.yellow.bold);
});
// ------------------ Lisiting route ------------------//
// -----------Error Handaler Middlewares-----------//
app.use(ErrorHandaler);
// -----------Error Handaler Middlewares-----------//