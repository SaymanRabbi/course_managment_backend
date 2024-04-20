const express = require("express");
const { Server } = require("socket.io");
const app = express();
const cors = require("cors");
const colors = require("colors");
const { ErrorHandaler } = require("./Middlewares/ErrorHandaler");
const port = process.env.PORT || 5000;
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
const dotenv = require("dotenv").config();
const { DBConnection } = require("./utils/dataBase");

// http://localhost:5173/dashboard/message

const userRoute = require("./Routes/UserRoute");
const courseRoute = require("./Routes/CourseRoute");
const chatRoute = require("./Routes/ChatRoute");
const messageRoute = require("./Routes/MessagesRoute");
// ------------------ Connect to Database ------------------//
DBConnection();
// ------------------ Connect to Database ------------------//
// ------------------ Middlewares ------------------//
const io = require("socket.io")(8800, {
  cors: {
    origin: "https://course-managment-backend.onrender.com",
    credentials: true,
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
    }
    // send all active users to new user
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { reciverId } = data;

    const user = activeUsers.find((user) => {
      return user.userId === reciverId;
    });

    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);

    // send all active users to all users
    io.emit("get-users", activeUsers);
  });
});
// ------------------ Middlewares ------------------//
// ------------------ Routes ------------------//

// ------------------ Routes ------------------//
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/message", messageRoute);
// ------------------ Lisiting route ------------------//

app.listen(port, () => {
  console.log(`Server is running on port ${port}`.yellow.bold);
});
// ------------------ Lisiting route ------------------//
// -----------Error Handaler Middlewares-----------//
app.use(ErrorHandaler);
// -----------Error Handaler Middlewares-----------//
