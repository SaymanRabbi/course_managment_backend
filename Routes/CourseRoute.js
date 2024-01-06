const { createCourseController } = require('../Controllers/courseController');
const { apiLimiter } = require('../Middlewares/ApiLimiter');
const { authorization } = require('../Middlewares/IsAdmin');
const VerifyToken = require('../Middlewares/VerifyToken');
const router = require('express').Router();
/**
 * @postAPI to create course in the application
 * @steps 1- send the request to the server 
 * @example http://localhost:5000/api/v1/course/create 
 * @rule 1- the request must be post request with the body of the request contain the following
 */
router.post('/create', apiLimiter,VerifyToken,authorization('admin',"teacher"),createCourseController);


module.exports = router;