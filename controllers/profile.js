const User = require('../models/user');
const bcrypt = require("bcrypt");
const emailvalidator = require("email-validator");
const Op = require('sequelize').Op;


exports.getProfile = (req, res, next) => {
  let message = req.flash('error');
  let sMessage = req.flash('success');
  if (req.session.isLoggedIn) {
    User.findOne({
      where: { email: req.session.user.email },
    }).then(userDoc => {
      if (userDoc) {
        res.render('auth/profile', {
          path: '/profile',
          pageTitle: 'Profile',
          errorMessage: message,
          successMessage: sMessage,
          user: userDoc
        });
      } else {
        res.redirect('/login');
      }
    })
      .catch(err => {
        console.log(err);
      });
  } else {
    res.redirect('/login');
  }
};

exports.postProfile = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    const name = req.body.name;
    const email = req.body.email;
    const userId = req.session.user.id;
    let errorMessage = successMessage = '';
    if (name == '') {
      errorMessage += 'Name can not be blank! / ';
    }
    if (!emailvalidator.validate(email)) {
      errorMessage += 'Please enter valid email! / ';
    }
    if (errorMessage != '') {
      req.flash('error', errorMessage);
      return res.redirect('/profile');
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
      user.name = req.body.name;
      user.email = req.body.email;
      user.save();
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        console.log(req.session);
      });
      req.flash('success', 'Data saved successfully.');
      res.redirect('/profile');
    } catch (err) {
      console.log(err);
    }

  } else {
    res.redirect('/login');
  }
};

exports.getChangePassword = (req, res, next) => {
  let message = req.flash('error');
  let sMessage = req.flash('success');
  if (req.session.isLoggedIn) {
    User.findOne({
      where: { email: req.session.user.email },
    }).then(userDoc => {
      if (userDoc) {
        res.render('auth/change_password', {
          path: '/change_password',
          pageTitle: 'Change Password',
          errorMessage: message,
          successMessage: sMessage,
          user: userDoc
        });
      } else {
        res.redirect('/login');
      }
    })
      .catch(err => {
        console.log(err);
      });
  } else {
    res.redirect('/login');
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
      return res.redirect('/change_password');
    }

    try {
      User.findOne({
        where: { email: req.session.user.email },
      })
        .then(user => {
          if (!user) {
            req.flash('error', 'Invalid Login');
            req.session.destroy();
            return res.redirect('/login');
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
                  res.redirect('/change_password');
                });
              }
              req.flash('error', 'Invalid current password.');
              res.redirect('/change_password');
            })
        });
    } catch (err) {
      console.log(err);
    }

  } else {
    res.redirect('/login');
  }
};