const Banner = require('../models/banner');
const Product = require('../models/product');
const Wishlist = require('../models/wishlist');
const Cart = require('../models/cart');
const Order = require('../models/order');
const date = require('date-and-time');
const Category = require('../models/category');


exports.getHome = async (req, res, next) => {
  try {
    const banners = await Banner.findAll({
      where: { active_status: 'Y' },
    });
    const products = await Product.findAll({
      where: { active_status: 'Y' },
    });
    res.render('index', {
      path: '/',
      pageTitle: 'Welcome',
      banners: banners,
      products: products,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const categoryId =  req.params.categoryId;
    let products;
    let categories = await Category.findAll();
    if(categoryId == 'all') {
      products = await Product.findAll({
        where: { active_status: 'Y' },
      });
    } else {
      products = await Product.findAll({
        where: { active_status: 'Y' , category_id: categoryId},
      });
    }
    res.render('products', {
      path: '/products',
      pageTitle: 'Products',
      products: products,
      categories: categories,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    let message = req.flash('error');
    const prodId = req.params.productId;
    //const product = await Product.findByPk(prodId);
    const product = await Product.findOne({ where: { id: prodId, active_status: 'Y'}, include: [{model: Category}]});
    console.log(product);
    let w_status = false;
    let c_status = false;
    if (req.session.isLoggedIn) {
      const w_saved = await Wishlist.findOne({ where: { user_id: req.session.user.id, product_id: prodId } });
      if (w_saved) {
        w_status = true;
      }
      const c_saved = await Cart.findOne({ where: { user_id: req.session.user.id, product_id: prodId } });
      if (c_saved) {
        c_status = true;
      }
    }
    res.render('product-details', {
      product: product,
      pageTitle: product.title,
      path: '/product',
      errorMessage: message,
      w_status: w_status,
      c_status: c_status
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAddToWishlist = async (req, res, next) => {
  try {
    if (req.session.isLoggedIn) {
      const prodId = req.params.productId;
      const userId = req.session.user.id;
      let errorMessage = '';

      Wishlist.findOne({
        where: {
          user_id: userId,
          product_id: prodId
        },
      }).then(userData => {
        if (!userData) {
          const wishlist = new Wishlist({
            user_id: userId,
            product_id: prodId
          });
          const data = wishlist.save();
          if (!data) {
            errorMessage = 'Sorry somthing is going wrong';
          }
        }
        req.flash('error', errorMessage);
        return res.redirect('/product/' + prodId);
      });
    } else {
      return res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getRemoveFromWishlist = async (req, res, next) => {
  try {
    if (req.session.isLoggedIn) {
      const prodId = req.params.productId;
      const callingPath = req.params.path;
      const userId = req.session.user.id;
      let errorMessage = '';

      Wishlist.findOne({
        where: {
          user_id: userId,
          product_id: prodId
        },
      }).then(userData => {
        if (userData) {
          const data = Wishlist.destroy({
            where: { user_id: userId,
            product_id: prodId }
          });
          if (!data) {
            errorMessage = 'Sorry somthing is going wrong';
          }
        } else {
          errorMessage = 'Sorry somthing is going wrong';
        }
        req.flash('error', errorMessage);
        if(callingPath == 'wishlist') {
          return res.redirect('/wishlist');
        } else {
          return res.redirect('/product/' + prodId);
        }
      });
    } else {
      return res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getWishlist = async (req, res, next) => {
  try {
    if (req.session.isLoggedIn) {
      let message = req.flash('error');
      const userId = req.session.user.id;
      const products = await Product.findAll({
        where: { active_status: 'Y' }, 
        include: [{model: Wishlist,
          where: {user_id: userId}
         }]
      });
      res.render('wishlist', {
        path: '/wishlist',
        pageTitle: 'Wishlist',
        products: products,
        errorMessage: message,
      });
    } else {
      return res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
  }
};



exports.getAddToCart = async (req, res, next) => {
  try {
    if (req.session.isLoggedIn) {
      const prodId = req.params.productId;
      const userId = req.session.user.id;
      let errorMessage = '';

      Cart.findOne({
        where: {
          user_id: userId,
          product_id: prodId
        },
      }).then(userData => {
        if (!userData) {
          const cart = new Cart({
            user_id: userId,
            product_id: prodId,
            qty: 1
          });
          const data = cart.save();
          if (!data) {
            errorMessage = 'Sorry somthing is going wrong';
          }
        }
        req.flash('error', errorMessage);
        return res.redirect('/product/' + prodId);
      });
    } else {
      return res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getRemoveFromCart = async (req, res, next) => {
  try {
    if (req.session.isLoggedIn) {
      const prodId = req.params.productId;
      const callingPath = req.params.path;
      const userId = req.session.user.id;
      let errorMessage = '';

      Cart.findOne({
        where: {
          user_id: userId,
          product_id: prodId
        },
      }).then(userData => {
        if (userData) {
          const data = Cart.destroy({
            where: { user_id: userId,
            product_id: prodId }
          });
          if (!data) {
            errorMessage = 'Sorry somthing is going wrong';
          }
        } else {
          errorMessage = 'Sorry somthing is going wrong';
        }
        req.flash('error', errorMessage);
        if(callingPath == 'cart') {
          return res.redirect('/cart');
        } else {
          return res.redirect('/product/' + prodId);
        }
      });
    } else {
      return res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    if (req.session.isLoggedIn) {
      let message = req.flash('error');
      const userId = req.session.user.id;
      const carts = await Cart.findAll({
        where: { user_id: userId }, 
        include: [{model: Product,
          where: {active_status: 'Y'}
         }]
      });
      console.log(carts);
      res.render('cart', {
        path: '/cart',
        pageTitle: 'Cart',
        carts: carts,
        errorMessage: message,
        address: req.session.user.full_address,
      });
    } else {
      return res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
  }
};


exports.getOrder = async (req, res, next) => {
  try {
    if (req.session.isLoggedIn) {
      let message = req.flash('error');
      const userId = req.session.user.id;
      const products = await Product.findAll({
        where: { active_status: 'Y' }, 
        include: [{model: Cart,
          where: {user_id: userId}
         }]
      });
      let random = Math.round(Math.random() * (99999999 - 10000000 + 1) + 10000000);
      const orderNumber = 'OD'+random;
      if (products.length> 0) {
        for (let prod of products) {
          const order = await new Order({
            order_number: orderNumber,
            user_id: userId,
            product_id: prod.id,
            product_price: prod.price,
            qty: 1,
            full_address: req.session.user.full_address,
            status: 'Confirmed'
          });
          order.save();
          const productU = await Product.findByPk(prod.id);
          productU.stock = productU.stock-1;
          productU.save();
        }
        const cartDel = await Cart.destroy({
          where: { user_id: userId }
        });
      }
      return res.redirect('/thank-you/'+orderNumber);
    } else {
      return res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getThankyou = async (req, res, next) => {
  try {
    if (req.session.isLoggedIn) {
      const orderNumber = req.params.order_number;
      const userId = req.session.user.id;
      const orders = await Product.findAll({ 
        include: [{model: Order,
          where: { user_id: userId,
          order_number: orderNumber }
         }]
      });
      
      res.render('thank-you', {
        path: '/thank-you',
        pageTitle: 'Thank You',
        products: orders,
        address: req.session.user.full_address,
        order_number: orderNumber
      });
    } else {
      return res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    if (req.session.isLoggedIn) {
      const userId = req.session.user.id;
      const orders = await Order.findAll({
        where: { user_id: userId }, 
        include: [{model: Product}]
      });
      console.log(orders);
      res.render('orders', {
        path: '/orders',
        pageTitle: 'Order History',
        orders: orders,
        date: date,
      });
    } else {
      return res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
  } 
};