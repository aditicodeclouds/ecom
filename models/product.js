const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  category_id: Sequelize.INTEGER,
  image: Sequelize.TEXT,
  price: Sequelize.DECIMAL,
  description: Sequelize.TEXT,
  stock: Sequelize.INTEGER,
  rating: Sequelize.DECIMAL,
  active_status: Sequelize.CHAR,
});

module.exports = Product;
