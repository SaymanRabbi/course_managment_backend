const express = require("express");
const socketIo = require("socket.io");
const app = express();
const cors = require("cors");
const colors = require("colors");
const http = require("http");
const server = http.createServer(app);
const { ErrorHandaler } = require("./Middlewares/ErrorHandaler");

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
const io = socketIo(5000, {
  cors: {
    origin: "https://starlit-zuccutto-9d1e7d.netlify.app",
    methods: ["GET", "POST"],
  },
});
const port = process.env.PORT || 5000;
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
let activeUsers = [];

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  // add new user
  socket.on("new-user-add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New user added:", newUserId);
    }
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;

    const user = activeUsers.find((user) => {
      return user.userId === receiverId;
    });

    if (user) {
      io.to(user.socketId).emit("receive-message", data);
      console.log("Message sent to:", receiverId);
    }
  });

  // handle disconnection
  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get-users", activeUsers);
    console.log("User disconnected:", socket.id);
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
