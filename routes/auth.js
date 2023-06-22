const path = require('path');

const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/register', authController.getRegister);

router.post('/register', authController.postRegister);

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/logout', authController.getLogout);

module.exports = router;

