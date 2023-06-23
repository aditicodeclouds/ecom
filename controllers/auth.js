const User = require('../models/user');
const bcrypt = require("bcrypt");
const emailvalidator = require("email-validator");

exports.getRegister = (req, res, next) => {
  let message = req.flash('error');
  res.render('auth/register', {
    path: '/register',
    pageTitle: 'Sign Up',
    errorMessage: message
  });
};

exports.postRegister = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    let errorMessage = '';
    if (name == '') {
      errorMessage += 'Name can not be blank! / ';
    }
    if(!emailvalidator.validate(email)){
      errorMessage += 'Please enter valid email! / ';
    }
    //if (password == '' || confirmPassword == '' || password != confirmPassword) {
    if (password == '' || confirmPassword == '') {
      errorMessage += 'Password does not matched! / ';
    }
    if(errorMessage != '') {
      req.flash('error', errorMessage);
      return res.redirect('/register');
    }
    User.findOne({
      where: { email: email },
    }).then(userDoc => {
        if (userDoc) {
          req.flash('error', 'E-Mail exists already, please pick a different one.');
          return res.redirect('/register');
        }
        return bcrypt
          .hash(password, 12)
          .then(hashedPassword => {
            const user = new User({
              name: name,
              email: email,
              password: hashedPassword
            });
            return user.save();
          })
          .then(result => {
            res.redirect('/login');
          });
      })
      .catch(err => {
        console.log(err);
      });
};

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({
    where: { email: email, type: 'User' },
  })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
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
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password.');
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.getLogout = (req, res, next) => {
  req.session.destroy();
  console.log('User log out');
  res.redirect('/login');
};