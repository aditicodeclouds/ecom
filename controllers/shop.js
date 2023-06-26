const Banner = require('../models/banner');
const Product = require('../models/product');
const Wishlist = require('../models/wishlist');
const Cart = require('../models/cart');


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
    const products = await Product.findAll({
      where: { active_status: 'Y' },
    });
    res.render('products', {
      path: '/products',
      pageTitle: 'Products',
      products: products,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    let message = req.flash('error');
    const prodId = req.params.productId;
    //Product.findOne({ where: { id: prodId}, include: [Wishlist]});
    //console.log(product.Wishlists);
    const product = await Product.findByPk(prodId);
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
      const products = await Product.findAll({
        where: { active_status: 'Y' }, 
        include: [{model: Cart,
          where: {user_id: userId}
         }]
      });
      console.log(products);
      res.render('cart', {
        path: '/cart',
        pageTitle: 'Cart',
        products: products,
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
      
      res.render('thank-you', {
        path: '/thank-you',
        pageTitle: 'Thank You',
        products: products,
        errorMessage: message
      });
    } else {
      return res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
  }
};