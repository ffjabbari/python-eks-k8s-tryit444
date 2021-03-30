//################ IMPORTS ################ 

const express = require('express')
const bodyParser = require('body-parser')
const port = 3000

const conn = require('./db-connector')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.raw())


//################ CONSTANTS ################ 

var PRICE_REGEX = /^\d+\.\d{2}$/
var EMAIL_REGEX = /^[\w-]+@[^\s@]+$/
var ID_REGEX = /^\d+$/
var STATES_ABBR = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]


//################ BOOK ROUTES ################ 

// Add Book:
app.post('/books', (req, res) => {
  if(!validateBook(req, res)) return
  
  conn.createBook(req.body.ISBN, req.body.title, req.body.Author, req.body.description, req.body.genre, req.body.price, req.body.quantity, () => {
    // If Already Exists
    res.statusCode = 422
    res.json({ message: 'This ISBN already exists in the system.' })
  }, () => {
    // Success
    res.statusCode = 201
    res.location(`/books/${req.body.ISBN}`)
    res.json(req.body)
  })
})

// Update Book:
// !!! VALIDATE ADMIN 
app.put('/books/:ISBN', (req, res) => {
  if(!validateBook(req, res)) return
  var oldISBN = req.params.ISBN

  if(oldISBN == req.body.ISBN){
    callToUpdate()
  } else {
    conn.getBook(req.body.ISBN, () => {
      // If Book not found (newISBN)
      callToUpdate()
    }, () => {
      res.statusCode = 422
      res.json({ message: 'The new ISBN already exists in the system.' }) // The logic is inverted — checks whether the NEW isbn exists BEFORE checking the OLD one
    })
  }

  function callToUpdate(){
    conn.updateBook(oldISBN, req.body.ISBN, req.body.title, req.body.Author, req.body.description, req.body.genre, req.body.price, req.body.quantity, () => {
      // If Book not found (oldISBN)
      res.statusCode = 404
      res.json({ message: 'No ISBN Found.' })
    }, () => {
      res.statusCode = 200
      res.json(req.body)
    })
  }
})

// Retrieve Book:
app.get('/books/isbn/:ISBN', (req, res) => {
  var ISBN = req.params.ISBN

  conn.getBook(ISBN, () => {
    // If Book not found
    res.statusCode = 404
    res.json({ message: 'No ISBN Found.' })
  }, (book) => {
    res.statusCode = 200
    res.json( book[0] )
  })
})


//################ CUSTOMER ROUTES ################ 

// Add Customer:
app.post('/customers', (req, res) => {
  if(!validateCustomer(req, res)) return

  conn.createCustomer(req.body.userId, req.body.name, req.body.phone, req.body.address, req.body.address2, req.body.city, req.body.state, req.body.zipcode, () => {
    // If Customer exists
    res.statusCode = 422
    res.json({ message: 'This user ID already exists in the system.' })
  }, (customerId) => {
    req.body['id'] = customerId
    res.statusCode = 201
    res.location(`/customers/${customerId}`)
    res.json(req.body)
  })  
})

// Retrieve Customer by ID:
app.get('/customers/:id', (req, res) => {
  var ID = req.params.id

  if(!ID || !ID_REGEX.test(ID)) {
    res.statusCode = 400
    res.json({ message: 'Malformed Input.' })
    return 
  }

  conn.getCustomer(ID, () => {
    // If cust not found
    res.statusCode = 404
    res.json({ message: 'No Customer Found.' })
  }, (customer) => {
    res.statusCode = 200
    res.json( customer[0] )
  })
  
  // Malformed input?????
})

// Retrieve Customer by EMAIL QUERY PARAM:
app.get('/customers', (req, res) => {
  var userId = req.query.userId

  if(!userId || !EMAIL_REGEX.test(userId)) {
    res.statusCode = 400
    res.json({ message: 'Malformed input.' })
    return
  }
  
  conn.getCustomerByEmail(userId, () => {
    // If cust not found
    res.statusCode = 404
    res.json({ message: 'No Customer Found.' })
  }, (customer) => {
    res.statusCode = 200
    res.json( customer[0] )
  })
})


//################ VIEW HELPERS ################ 

function validateBook(req, res) {

  if(
    !req.body.ISBN || 
    !req.body.title || 
    !req.body.Author || 
    !req.body.description || 
    !req.body.genre || 
    !req.body.price || 
    !req.body.quantity ||
    !PRICE_REGEX.test(req.body.price) 
  ){
    res.statusCode = 400
    res.json({ message: 'Malformed input.' })
    return false
  }
  return true
}

function validateCustomer(req, res) {

  if (
    !req.body.userId || 
    !req.body.name || 
    !req.body.phone || 
    !req.body.address || 
    // !req.body.address2 ||  // NOT REQUIRED
    !req.body.city || 
    !req.body.state || 
    !req.body.zipcode || 
    !EMAIL_REGEX.test(req.body.userId) || 
    !STATES_ABBR.includes(req.body.state)
  ){
    res.statusCode = 400
    res.json({ message: 'Malformed input.' })
    return false
  }
  return true
}

app.listen(port, () => {
  conn.setRDSConnection()
  console.log(`Example app listening at http://localhost:${port}`)
})



