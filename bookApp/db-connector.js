
//################ CONNECTION SETUP ################

var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : '',
  user     : '',
  password : '',
  port     : '',
  // debug    : true
  database : 'Books_DB',
})


//################ QUERY TEMPLATES ################

var INSERT_BOOK_SQL = 'INSERT INTO books (ISBN, title, Author, description, genre, price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?);'
var UPDATE_BOOK_SQL = 'UPDATE books SET ISBN = ?, title = ?, Author = ?, description = ?, genre = ?, price = ?, quantity = ? WHERE ISBN = ?;'
var GET_BOOK_SQL = 'SELECT * FROM books WHERE ISBN = ? LIMIT 1;'

var INSERT_CUSTOMER_SQL = 'INSERT INTO customers (userId, name, phone, address, address2, city, state, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?);'
var INSERT_CUSTOMER_SQL_OPT = 'INSERT INTO customers (userId, name, phone, address, city, state, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?);'
var GET_CUSTOMER_SQL = 'SELECT * FROM customers WHERE id = ? LIMIT 1;'
var GET_CUSTOMER_SQL_ALT = 'SELECT * FROM customers WHERE userId = ? LIMIT 1;'


//################ QUERY HELPERS ################

function testConnection() {
  connection.connect(function(err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack)
      connection.end()
    } else {
      console.log('Connection success')
      connection.end()
    }
  })
}


//################ BOOK QUERIES ################

function createBook(ISBN, title, Author, description, genre, price, quantity, exists, success){
  connection.query(INSERT_BOOK_SQL, [ISBN, title, Author, description, genre, price, quantity], function (err, result) {
    if (err) { exists() } 
    else { success() }
  })
}

function getBook(ISBN, notFound, success){
  connection.query(GET_BOOK_SQL, [ISBN], function (err, result) {
    if (err || result.length == 0) { notFound() } 
    else { success(result) }
  })
}

function updateBook(oldISBN, ISBN, title, Author, description, genre, price, quantity, notFound, success){
  connection.query(UPDATE_BOOK_SQL, [ISBN, title, Author, description, genre, price, quantity, oldISBN], function (err, result) {
    if (err || result.affectedRows == 0) { notFound() } 
    else { success() }
  })
}


//################ CUSTOMER QUERIES ################

function createCustomer(userId, name, phone, address, address2, city, state, zipcode, exists, success){
  var sqlTemplate = INSERT_CUSTOMER_SQL
  var params = [userId, name, phone, address, address2, city, state, zipcode]

  if(!address2) { 
    sqlTemplate=INSERT_CUSTOMER_SQL_OPT 
    params = [userId, name, phone, address, city, state, zipcode]
  }

  connection.query(sqlTemplate, params, function (err, result) {
    if (err) { exists() } 
    else { success(result.insertId) }
  })
}

function getCustomer(ID, notFound, success){
  connection.query(GET_CUSTOMER_SQL, [ID], function (err, result) {
    if (err || result.length == 0) { notFound() } 
    else { success(result) }
  })
}

function getCustomerByEmail(userId, notFound, success){
  connection.query(GET_CUSTOMER_SQL_ALT, [userId], function (err, result) {
    if (err || result.length == 0) { notFound() } 
    else { success(result) }
  })
}


//################ MODULE EXPORT ################

module.exports = { testConnection, createBook, updateBook, getBook, createCustomer, getCustomer, getCustomerByEmail }