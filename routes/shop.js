const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getHome);

router.get('/products', shopController.getProducts);

router.get('/product/:productId', shopController.getProduct);

router.get('/add-to-wishlist/:productId', shopController.getAddToWishlist);

router.get('/remove-from-wishlist/:productId/:path', shopController.getRemoveFromWishlist);

router.get('/wishlist', shopController.getWishlist);

router.get('/add-to-cart/:productId', shopController.getAddToCart);

router.get('/remove-from-cart/:productId/:path', shopController.getRemoveFromCart);

router.get('/cart', shopController.getCart);

router.get('/order', shopController.getOrder);

router.get('/thank-you/:order_number', shopController.getThankyou);

router.get('/orders', shopController.getOrders);

module.exports = router;

