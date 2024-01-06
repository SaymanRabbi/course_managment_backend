const { userCreateController,userLoginController } = require('../Controllers/userController');
const { apiLimiter } = require('../Middlewares/ApiLimiter');

const router = require('express').Router();
/**
 * @postAPI to register user in the application
 * @steps 1- send the request to the server 
 * @example http://localhost:5000/api/v1/user/register 
 * @rule 1- the request must be post request with the body of the request contain the following
 */
router.post('/register', apiLimiter,userCreateController);
/**
 * @getAPI to login user in the application
 * @steps 1- send the request to the server 
 * @example http://localhost:5000/api/v1/user/login 
 * @rule 1- the request must be get request with the body of the request contain the following
 */
router.get('/login',apiLimiter,userLoginController)

module.exports = router;