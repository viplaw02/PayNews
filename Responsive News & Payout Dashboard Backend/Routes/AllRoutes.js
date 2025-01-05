const express = require('express');
const router = express.Router();
const {Signup,Login,AdminPayout} = require('../controller/Auth')


router.post('/signup', Signup);
router.post('/login', Login);
router.post('/adminpayout',AdminPayout);
module.exports = router;