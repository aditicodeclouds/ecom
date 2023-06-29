const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');

const User = require('./models/user');
const Product = require('./models/product');
const Category = require('./models/category');
const Wishlist = require('./models/wishlist');
const Cart = require('./models/cart');
const Order = require('./models/order');

const app = express();
const csrfProtection = csrf();
app.set('view engine', 'ejs');
app.set('views', 'views'); 

const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const profileRoutes = require('./routes/profile');
const { count } = require('console');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'geeksforgeeks',
  saveUninitialized: true,
  resave: true
}));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  res.locals.wishlistCount = res.locals.cartCount = 0;
  if(req.session.isLoggedIn) {
    Wishlist.findAll({
      where: {
        user_id: req.session.user.id
      }
    }).then(wData => {
      if (wData) {
        res.locals.wishlistCount = wData.length;
      } 
    });
           
    Cart.findAll({
      where: {
        user_id: req.session.user.id
      }
    }).then(cData => {
      if (cData) {
        res.locals.cartlistCount = cData.length;
      }
    });
  }
  next();
});

app.use(authRoutes);
app.use(shopRoutes);
app.use(profileRoutes);

app.use(errorController.get404);

User.hasMany(Wishlist, {foreignKey: 'user_id'});
Product.hasMany(Wishlist, {foreignKey: 'product_id'});
Wishlist.hasMany(Product, {foreignKey: 'id'});

User.hasMany(Cart, {foreignKey: 'user_id'});
Product.hasMany(Cart, {foreignKey: 'product_id'});
Cart.belongsTo(Product, {foreignKey: 'product_id'});

User.hasMany(Order, {foreignKey: 'user_id'});
Product.hasMany(Order, {foreignKey: 'product_id'});
Order.belongsTo(Product, {foreignKey: 'product_id'});

Category.hasMany(Product, {foreignKey: 'category_id'});
Product.belongsTo(Category, {foreignKey: 'category_id'});


app.listen(3000);
