const path = require('path');
const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();

router.get('/login', adminController.getLogin);

router.post('/login', adminController.postLogin);

router.get('/logout', adminController.getLogout);

router.get('/profile', adminController.getProfile);

router.post('/profile', adminController.postProfile);

router.get('/change_password', adminController.getChangePassword);

router.post('/change_password', adminController.postChangePassword);

router.get('/dashboard', adminController.getDashboard);

module.exports = router;

