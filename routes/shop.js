const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getHome);

router.get('/products', shopController.getProducts);

router.get('/product/:productId', shopController.getProduct);

router.get('/add-to-wishlist/:productId', shopController.getAddToWishlistProduct);

router.get('/remove-from-wishlist/:productId', shopController.getRemoveFromWishlistProduct);

module.exports = router;

