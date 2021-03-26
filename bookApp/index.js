const express = require('express')
const bodyParser = require('body-parser')
const port = 3000

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.raw())

//################ CONSTANTS ################ 

var PRICE_REGEX = /^\d+\.\d{2}$/
var EMAIL_REGEX = /^[\w-]+@[^\s@]+$/
var STATES_ABBR = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]


//################ BOOK ROUTES ################ 

// Add Book:
app.post('/books', (req, res) => {
  validateBook(req, res)
  
  // If exists
  res.statusCode = 422
  res.json({ message: 'This ISBN already exists in the system.' })

  res.statusCode = 201
  res.location(`/books/${req.body.ISBN}`)
  res.json(req.body)
})

// Update Book:
// !!! VALIDATE ADMIN 
app.put('/books/:ISBN', (req, res) => {
  var inISBN = req.params.ISBN

  // Update all book vals

  // If Book not found
  res.statusCode = 404
  res.json({ message: 'No ISBN Found.' })

  validateBook(req, res)

  res.statusCode = 200
  res.json(req.body)
})

// Retrieve Book:
app.get('/books/isbn/:ISBN', (req, res) => {
  console.log(`URL PARAM: /books/${req.params.ISBN}`)

  // Get book 
  // var book = 

  // If Book not found
  res.statusCode = 404
  res.json({ message: 'No ISBN Found.' })

  // RETURN BOOK
  res.statusCode = 200
  res.json({ field: '?' })
})


//################ CUSTOMER ROUTES ################ 

// Add Customer:
app.post('/customers', (req, res) => {
  validateCustomer(req, res)

  // If Customer exists
  res.statusCode = 422
  res.json({ message: 'This user ID already exists in the system.' })

  // RETURN CUSTOMER
  res.statusCode = 201
  var custID = 121123
  res.location(`/customers/${custID}`)
  res.json({ field: '?' })
})

// Retrieve Customer by ID:
app.get('/customers/:id', (req, res) => {
  console.log(`URL PARAM: ${req.params.id}`)

  // Malformed input?????
  
  // Get cust
  // var cust = 

  // If cust not found
  res.statusCode = 404
  res.json({ message: 'No Customer Found.' })

  // RETURN CUST
  res.statusCode = 200
  res.json({ field: '?' })
})

// Retrieve Customer by EMAIL QUERY PARAM:
app.get('/customers', (req, res) => {
  console.log(`QUERY PARAM: ${req.query.userId}`)

  if(!req.query.userId) {
    res.statusCode = 400
    res.json({ message: 'Malformed input.' })
  }
  
  // Get cust
  // var cust = 

  // If cust not found
  res.statusCode = 404
  res.json({ message: 'No Customer Found.' })

  // RETURN CUST
  res.statusCode = 200
  res.json({ field: '?' })
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
  }
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
  }
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



