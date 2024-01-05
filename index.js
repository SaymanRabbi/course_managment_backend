const express = require('express');
const app = express();
const cors = require('cors');
const colors = require('colors');
const { DBConnection } = require('./utils/dataBase');
const { ErrorHandaler } = require('./Middlewares/ErrorHandaler');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
// ------------------ Connect to Database ------------------//
DBConnection();
// ------------------ Connect to Database ------------------//
// ------------------ Middlewares ------------------//
app.use(cors());
app.use(express.json());
// ------------------ Middlewares ------------------//

// ------------------ Routes ------------------//
// ------------------ Routes ------------------//

// ------------------ Lisiting route ------------------//
app.listen(port, () => {
    console.log(`Server is running on port ${port}`.yellow.bold);
});
// ------------------ Lisiting route ------------------//
// -----------Error Handaler Middlewares-----------//
app.use(ErrorHandaler);
// -----------Error Handaler Middlewares-----------//