const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {pool} = require('./config')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

const getStock = (request, response) => {
  pool.query('SELECT * FROM stock', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addStock = (request, response) => {
  const {product, units} = request.body

  pool.query(
    'INSERT INTO  (product, units) VALUES ($1, $2)',
    [product, units],
    (error) => {
      if (error) {
        throw error
      }
      response.status(201).json({status: 'success', message: 'Stock added.'})
    },
  )
}

app
  .route('/stocks')
  // GET endpoint
  .get(getStock)
  // POST endpoint
  .post(addStock)

// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`)
})
