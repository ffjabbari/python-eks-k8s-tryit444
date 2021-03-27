
var mysql = require('mysql')

var connection = mysql.createConnection({
  host     : 'bookapp-db2.cmq3jk4xdq0d.us-east-1.rds.amazonaws.com',
  user     : 'root',
  password : 'toor-arr',
  port     : '3306',
  debug    : true
  // database : 'bookapp-db',
})

function createSchema() {
  connection.connect(function(err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack)
      connection.end()
    } else {
      console.log('Connection SUCCESS')
      connection.end()
    }

    // Create BOOKS
    // var sql = "CREATE TABLE books (id INT NOT NULL AUTO_INCREMENT, ISBN VARCHAR(255), title VARCHAR(255), Author VARCHAR(255), description VARCHAR(255), genre VARCHAR(255), price DECIMAL(7,2), quantity INT)"
    // connection.query(sql, function (err, result) {
    //   if (err) {
    //     console.error(err)
    //   } else {
    //     console.log("Books created")
    //   }
    //   connection.end()
    // })

    // // Create CUSTOMERS
    // var sql = "CREATE TABLE customers (id INT NOT NULL AUTO_INCREMENT, userId VARCHAR(255), name VARCHAR(255), phone VARCHAR(255), address VARCHAR(255), address2 VARCHAR(255), city VARCHAR(255), state VARCHAR(2), zipcode VARCHAR(5))"
    // connection.query(sql, function (err, result) {
    //   if (err) {
    //     console.error(err)
    //   } else {
    //     console.log("Customers created")
    //   }
    //   connection.end()
    // })
  })
}


module.exports = { createSchema }