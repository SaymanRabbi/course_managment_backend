const express = require('express');
const app = express();
const cors = require('cors');
const colors = require('colors');
const { ErrorHandaler } = require('./Middlewares/ErrorHandaler');
const port = process.env.PORT || 5000;
app.use(cors(
    {
        origin: '*',
        credentials: true
    }
));

app.use(express.json());
const dotenv = require('dotenv').config();
const { DBConnection } = require('./utils/dataBase');

// http://localhost:5173/dashboard/message

const userRoute = require('./Routes/UserRoute');
const courseRoute = require('./Routes/CourseRoute');
const chatRoute = require('./Routes/ChatRoute');
const messageRoute = require('./Routes/MessagesRoute');
// ------------------ Connect to Database ------------------//
DBConnection();
// ------------------ Connect to Database ------------------//
// ------------------ Middlewares ------------------//

// ------------------ Middlewares ------------------//
// ------------------ Routes ------------------//

// ------------------ Routes ------------------//
 app.use('/api/v1/user', userRoute);
 app.use('/api/v1/course', courseRoute);
 app.use('/api/v1/chat', chatRoute);
app.use('/api/v1/message', messageRoute);
// ------------------ Lisiting route ------------------//






app.listen(port, () => {
    console.log(`Server is running on port ${port}`.yellow.bold);
});
// ------------------ Lisiting route ------------------//
// -----------Error Handaler Middlewares-----------//
app.use(ErrorHandaler);
// -----------Error Handaler Middlewares-----------//