const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Banner = sequelize.define('banner', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  banner_image: Sequelize.STRING,
  banner_heading1: Sequelize.STRING,
  banner_heading2: Sequelize.STRING,
  banner_description: Sequelize.STRING,
  banner_link: Sequelize.STRING,
  active_status: Sequelize.CHAR
});
 
module.exports = Banner;
