const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('dummydatabase', 'root', 'Spathak@1', {
    dialect: "mysql",
    host: 'localhost'
})


module.exports = sequelize