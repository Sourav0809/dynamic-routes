const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'dummydatabase',
    password: 'Spathak@1'
})

module.exports = pool.promise()