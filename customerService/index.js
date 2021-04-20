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

var EMAIL_REGEX = /^[\w-]+@[^\s@]+$/
var ID_REGEX = /^\d+$/
var STATES_ABBR = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]


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
    res.location(`${req.headers.host}/customers/${customerId}`)
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

// Get Status: Liveness Check
app.get('/status', (req, res) => {
  res.statusCode = 200
  res.json({})
})


//################ VIEW HELPERS ################ 

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


//################ =+= ################ 

app.listen(port, () => {
  conn.setRDSConnection()
  console.log(`customerService listening @ http://localhost:${port}`)
})



