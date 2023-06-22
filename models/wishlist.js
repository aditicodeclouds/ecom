const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Wishlist = sequelize.define('wishlist', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  user_id: Sequelize.INTEGER,
  product_id: Sequelize.INTEGER
});
 
module.exports = Wishlist;
