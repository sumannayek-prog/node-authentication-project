const express = require('express');
const { login, register } = require('../Controller/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

module.exports = router;
