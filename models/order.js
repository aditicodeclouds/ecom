const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Order = sequelize.define('order', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  order_number: Sequelize.STRING,
  user_id: Sequelize.INTEGER,
  product_id: Sequelize.INTEGER,
  product_price: Sequelize.FLOAT,
  qty: Sequelize.INTEGER,
  full_address: Sequelize.TEXT,
  status: {
    type:   Sequelize.ENUM,
    values: ['Confirmed', 'Shipped', 'Delivered']
  }
});
 
module.exports = Order;
