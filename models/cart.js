const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Cart = sequelize.define('cart', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  user_id: Sequelize.INTEGER,
  product_id: Sequelize.INTEGER,
  qty: Sequelize.INTEGER
});
 
module.exports = Cart;
