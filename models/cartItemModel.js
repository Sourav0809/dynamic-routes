const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const cartItemModel = sequelize.define('cartItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  quantity: {
    type: Sequelize.INTEGER

  }
})


module.exports = cartItemModel