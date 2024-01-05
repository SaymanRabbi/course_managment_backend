const { userCreateController } = require('../Controllers/userController');

const router = require('express').Router();

router.post('/register', userCreateController);

module.exports = router;