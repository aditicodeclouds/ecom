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

router.get('/banners', adminController.getBanners);
router.get('/banner/:id', adminController.getBanner);
router.post('/banner/:id', adminController.postBanner);
router.get('/banner-delete/:id', adminController.getBannerDelete);

router.get('/products', adminController.getProducts);
router.get('/product/:id', adminController.getProduct);
router.post('/product/:id', adminController.postProduct);
router.get('/product-delete/:id', adminController.getProductDelete);

router.get('/categories', adminController.getCategories);
router.get('/category/:id', adminController.getCategory);
router.post('/category/:id', adminController.postCategory);
router.get('/category-delete/:id', adminController.getCategoryDelete);

module.exports = router;

