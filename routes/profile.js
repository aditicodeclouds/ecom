const path = require('path');

const express = require('express');

const profileController = require('../controllers/profile');

const router = express.Router();

router.get('/profile', profileController.getProfile);

router.post('/profile', profileController.postProfile);

router.get('/change_password', profileController.getChangePassword);

router.post('/change_password', profileController.postChangePassword);

module.exports = router;

