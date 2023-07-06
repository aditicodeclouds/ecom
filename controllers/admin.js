const User = require('../models/user');
const Banner = require('../models/banner');
const Product = require('../models/product');
const Category = require('../models/category');
const Order = require('../models/order');


const bcrypt = require("bcrypt");
const emailvalidator = require("email-validator");
const Op = require('sequelize').Op;
const date = require('date-and-time');

exports.getLogin = (req, res, next) => {
  if (req.session.isLoggedIn) {
    res.redirect('/admin/dashboard');
  } else {
    let message = req.flash('error');
    res.render('admin/login', {
      path: '/admin/login',
      pageTitle: 'Login',
      errorMessage: message
    });
  }
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({
    where: { email: email, type: 'Admin' },
  })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/admin/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              console.log(req.session);
              res.redirect('/admin/dashboard');
            });
          }
          req.flash('error', 'Invalid email or password.');
          res.redirect('/admin/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/admin/login');
        });
    })
    .catch(err => console.log(err));
};


exports.getLogout = (req, res, next) => {
  req.session.destroy();
  console.log('User log out');
  res.redirect('/admin/login');
};

exports.getProfile = (req, res, next) => {
  let message = req.flash('error');
  let sMessage = req.flash('success');
  if (req.session.isLoggedIn) {
    User.findOne({
      where: { email: req.session.user.email, type: 'Admin' },
    }).then(userDoc => {
      if (userDoc) {
        res.render('admin/profile', {
          path: '/admin/profile',
          pageTitle: 'Profile',
          errorMessage: message,
          successMessage: sMessage,
          user: userDoc
        });
      } else {
        res.redirect('/admin/login');
      }
    })
      .catch(err => {
        console.log(err);
      });
  } else {
    res.redirect('/admin/login');
  }
};

exports.postProfile = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    const name = req.body.name;
    const email = req.body.email;
    const full_address = req.body.full_address;
    const userId = req.session.user.id;
    let errorMessage = successMessage = '';
    if (name == '') {
      errorMessage += 'Name can not be blank! / ';
    }
    if (!emailvalidator.validate(email)) {
      errorMessage += 'Please enter valid email! / ';
    }
    if (full_address == '') {
      errorMessage += 'Address can not be blank! / ';
    }
    if (errorMessage != '') {
      req.flash('error', errorMessage);
      return res.redirect('/admin/profile');
    }

    try {
      const userDoc = await User.findOne({
        where: { email: email, id: { [Op.ne]: userId } },
      });
      if (userDoc) {
        req.flash('error', 'E-Mail exists already, please pick a different one.');
        return res.redirect('/profile');
      }
    } catch (err) {
      console.log(err);
    }

    try {
      const user = await User.findByPk(userId);
      user.name = name;
      user.email = email;
      user.full_address = full_address;
      user.save();
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        console.log(req.session);
      });
      req.flash('success', 'Data saved successfully.');
      res.redirect('/admin/profile');
    } catch (err) {
      console.log(err);
    }

  } else {
    res.redirect('/admin/login');
  }
};

exports.getChangePassword = (req, res, next) => {
  let message = req.flash('error');
  let sMessage = req.flash('success');
  if (req.session.isLoggedIn) {
    User.findOne({
      where: { email: req.session.user.email, type: 'Admin' },
    }).then(userDoc => {
      if (userDoc) {
        res.render('admin/change_password', {
          path: '/admin/change_password',
          pageTitle: 'Change Password',
          errorMessage: message,
          successMessage: sMessage,
          user: userDoc
        });
      } else {
        res.redirect('/admin/login');
      }
    })
      .catch(err => {
        console.log(err);
      });
  } else {
    res.redirect('/admin/login');
  }
};

exports.postChangePassword = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    const oldPassword = req.body.old_password;
    const newPassword = req.body.new_password;
    const conPassword = req.body.con_password;
    let errorMessage = successMessage = '';
    if (oldPassword == '') {
      errorMessage += 'Old Password can not be blank! / ';
    }
    if (newPassword == '') {
      errorMessage += 'New Password can not be blank! / ';
    }
    if (conPassword == '') {
      errorMessage += 'Confirm Password can not be blank! / ';
    }
    if (newPassword != conPassword) {
      errorMessage += 'New and Confirm Password must be same!';
    }
    if (errorMessage != '') {
      req.flash('error', errorMessage);
      return res.redirect('/admin/change_password');
    }

    try {
      User.findOne({
        where: { email: req.session.user.email, type: 'Admin' },
      })
        .then(user => {
          if (!user) {
            req.flash('error', 'Invalid Login');
            req.session.destroy();
            return res.redirect('/admin/login');
          }
          bcrypt
            .compare(oldPassword, user.password)
            .then(doMatch => {
              if (doMatch) {
                return bcrypt
                  .hash(newPassword, 12)
                  .then(hashedPassword => {
                    user.password = hashedPassword;
                    user.save();
                  })
                  .then(result => {
                    req.flash('success', 'Data saved successfully.');
                    res.redirect('/admin/change_password');
                  });
              }
              req.flash('error', 'Invalid current password.');
              res.redirect('/admin/change_password');
            })
        });
    } catch (err) {
      console.log(err);
    }

  } else {
    res.redirect('/admin/login');
  }
};


exports.getDashboard = (req, res, next) => {
  if (req.session.isLoggedIn) {
    let message = req.flash('error');
    res.render('admin/dashboard', {
      path: '/dashboard',
      pageTitle: 'Dashboard',
      errorMessage: message
    });
  } else {
    res.redirect('/admin/login');
  }
};

exports.getBanners = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    try {
      let message = req.flash('error');
      let sMessage = req.flash('success');
      const banners = await Banner.findAll();

      res.render('admin/banner/list', {
        path: '/admin/banners',
        pageTitle: 'Banner',
        banners: banners,
        date: date,
        errorMessage: message,
        successMessage: sMessage
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect('/admin/login');
  }
};

exports.getBanner = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    try {
      let message = req.flash('error');
      let sMessage = req.flash('success');
      const id = req.params.id;
      let banner = [];
      if (id != 'add') {
        banner = await Banner.findOne({
          where: { id: id },
        });
      }
      res.render('admin/banner/form', {
        path: '/admin/banner',
        pageTitle: 'Banner',
        banner: banner,
        date: date,
        errorMessage: message,
        successMessage: sMessage,
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect('/admin/login');
  }
};

exports.postBanner = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    try {
      let errorMessage = '';
      const id = req.body.id;
      if (req.body.banner_heading1 == '') {
        errorMessage += 'Heading1 can not be blank! / ';
      }
      if (req.body.banner_description == '') {
        errorMessage += 'Description can not be blank! / ';
      }
      if (errorMessage != '') {
        req.flash('error', errorMessage);
        return res.redirect('/admin/banner/' + id);
      }

      let banner;
      if (id == 'add') {
        banner = new Banner();
        console.log('add');
      } else {
        banner = await Banner.findByPk(id);
        console.log('update');
      }
      banner.banner_heading1 = req.body.banner_heading1;
      banner.banner_heading2 = req.body.banner_heading2;
      banner.banner_description = req.body.banner_description;
      banner.banner_link = req.body.banner_link;
      banner.active_status = req.body.active_status;
      let data = banner.save();

      if (data) {
        req.flash('success', 'Data saved successfully.');
      } else {
        req.flash('error', 'Something is going wrong. Please try again.');
      }
      res.redirect('/admin/banner/' + id);
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect('/admin/login');
  }
};

exports.getBannerDelete = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    const data = Banner.destroy({
      where: { id: req.params.id }
    });
    if (data) {
      req.flash('success', 'Record deleted successfully.');
    } else {
      req.flash('error', 'Something is going wrong. Please try again.');
    }
    res.redirect('/admin/banners');
  } else {
    res.redirect('/admin/login');
  }
};


exports.getCategories = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    try {
      let message = req.flash('error');
      let sMessage = req.flash('success');
      const categories = await Category.findAll();

      res.render('admin/category/list', {
        path: '/admin/categories',
        pageTitle: 'Category',
        categories: categories,
        date: date,
        errorMessage: message,
        successMessage: sMessage
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect('/admin/login');
  }
};

exports.getCategory = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    try {
      let message = req.flash('error');
      let sMessage = req.flash('success');
      const id = req.params.id;
      let category = [];
      if (id != 'add') {
        category = await Category.findOne({
          where: { id: id },
        });
      }
      res.render('admin/category/form', {
        path: '/admin/category',
        pageTitle: 'Category',
        category: category,
        date: date,
        errorMessage: message,
        successMessage: sMessage,
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect('/admin/login');
  }
};

exports.postCategory = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    try {
      let errorMessage = '';
      const id = req.body.id;
      if (req.body.name == '') {
        errorMessage += 'Name can not be blank! / ';
      }
      if (errorMessage != '') {
        req.flash('error', errorMessage);
        return res.redirect('/admin/category/' + id);
      }

      let category;
      if (id == 'add') {
        category = new Category();
      } else {
        category = await Category.findByPk(id);
      }
      category.name = req.body.name;
      let data = category.save();

      if (data) {
        req.flash('success', 'Data saved successfully.');
      } else {
        req.flash('error', 'Something is going wrong. Please try again.');
      }
      res.redirect('/admin/category/' + id);
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect('/admin/login');
  }
};

exports.getCategoryDelete = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    const data = Category.destroy({
      where: { id: req.params.id }
    });
    if (data) {
      req.flash('success', 'Record deleted successfully.');
    } else {
      req.flash('error', 'Something is going wrong. Please try again.');
    }
    res.redirect('/admin/categories');
  } else {
    res.redirect('/admin/login');
  }
};



exports.getProducts = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    try {
      let message = req.flash('error');
      let sMessage = req.flash('success');
      const products = await Product.findAll();

      res.render('admin/product/list', {
        path: '/admin/products',
        pageTitle: 'Product',
        products: products,
        date: date,
        errorMessage: message,
        successMessage: sMessage
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect('/admin/login');
  }
};

exports.getProduct = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    try {
      let message = req.flash('error');
      let sMessage = req.flash('success');
      const id = req.params.id;
      let product = [];
      if (id != 'add') {
        product = await Product.findOne({
          where: { id: id },
        });
      }
      const categories = await Category.findAll();
      res.render('admin/product/form', {
        path: '/admin/product',
        pageTitle: 'Product',
        product: product,
        categories: categories,
        date: date,
        errorMessage: message,
        successMessage: sMessage,
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect('/admin/login');
  }
};

exports.postProduct = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    try {
      let errorMessage = '';
      const id = req.body.id;
      console.log(typeof req.body.stock);
      console.log(typeof req.body.price);
      if (req.body.name == '') {
        errorMessage += 'Name can not be blank! / ';
      }
      if (req.body.category_id == '') {
        errorMessage += 'Category can not be blank! / ';
      }
      if (req.body.image == '') {
        errorMessage += 'Image can not be blank! / ';
      }
      if (req.body.price == '') {
        errorMessage += 'Price can not be blank! / ';
      }
      if (req.body.description == '') {
        errorMessage += 'Description can not be blank! / ';
      }
      if (req.body.stock == '') {
        errorMessage += 'Stock can not be blank! / ';
      }
      if (errorMessage != '') {
        req.flash('error', errorMessage);
        return res.redirect('/admin/product/' + id);
      }

      let product;
      if (id == 'add') {
        product = new Product();
      } else {
        product = await Product.findByPk(id);
      }
      product.name = req.body.name;
      product.category_id = req.body.category_id;
      product.image = req.body.image;
      product.price = req.body.price;
      product.description = req.body.description;
      product.stock = req.body.stock;
      product.active_status = req.body.active_status;
      let data = product.save();

      if (data) {
        req.flash('success', 'Data saved successfully.');
      } else {
        req.flash('error', 'Something is going wrong. Please try again.');
      }
      res.redirect('/admin/product/' + id);
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect('/admin/login');
  }
};

exports.getProductDelete = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    const data = Product.destroy({
      where: { id: req.params.id }
    });
    if (data) {
      req.flash('success', 'Record deleted successfully.');
    } else {
      req.flash('error', 'Something is going wrong. Please try again.');
    }
    res.redirect('/admin/products');
  } else {
    res.redirect('/admin/login');
  }
};


exports.getUsers = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    try {
      let message = req.flash('error');
      let sMessage = req.flash('success');
      const Users = await User.findAll({
        where: { type: 'User' }
      });

      res.render('admin/user/list', {
        path: '/admin/users',
        pageTitle: 'Users',
        users: Users,
        date: date,
        errorMessage: message,
        successMessage: sMessage
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect('/admin/login');
  }
};


exports.getOrders = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    try {
      let message = req.flash('error');
      let sMessage = req.flash('success');
      const orders = await Order.findAll({ 
        include: [{model: Product},{model: User}],
      });
      console.log(orders);
      res.render('admin/order/list', {
        path: '/admin/orders',
        pageTitle: 'Orders',
        orders: orders,
        date: date,
        errorMessage: message,
        successMessage: sMessage
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect('/admin/login');
  }
};

exports.getOrder = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    try {
      let message = req.flash('error');
      let sMessage = req.flash('success');
      const id = req.params.id;
      const order = await Order.findOne({
        where: { id: id },
        include: [{model: Product},{model: User}]
      });
      res.render('admin/order/view', {
        path: '/admin/order',
        pageTitle: 'Order',
        order: order,
        date: date,
        errorMessage: message,
        successMessage: sMessage,
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect('/admin/login');
  }
};


exports.getOrderStatus = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    try {
      let message = req.flash('error');
      let sMessage = req.flash('success');
      const id = req.params.id;
      const order = await Order.findByPk(id);
      let date_ob = new Date();
      if(order.status=='Confirmed') {
        order.shippedAt = date.format(date_ob,'YYYY-MM-DD HH:mm:ss');
      } else {
        order.deliveredAt = date.format(date_ob,'YYYY-MM-DD HH:mm:ss');
      }
      order.status = (order.status=='Confirmed'? 'Shipped' : 'Delivered');
      let data = order.save();

      if (data) {
        req.flash('success', 'Order '+order.status+' successfully.');
      } else {
        req.flash('error', 'Something is going wrong. Please try again.');
      }
      res.redirect('/admin/order/'+id);
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect('/admin/login');
  }
};