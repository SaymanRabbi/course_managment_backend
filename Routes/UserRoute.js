const { userCreateController,userLoginController } = require('../Controllers/userController');

const router = require('express').Router();

router.post('/register', userCreateController);
router.get('/login',userLoginController)

module.exports = router;