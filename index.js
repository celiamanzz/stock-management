const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {pool} = require('./config')
const path = require('path');

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

const getStockById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM stock WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addStock = (request, response) => {
console.log(request.body)

  const {product, units} = request.body

  pool.query(
    'INSERT INTO  stock(product, units) VALUES ($1, $2)',
    [product, units],
    (error) => {
      if (error) {
        throw error
      }
      response.status(201).json({status: 'success', message: 'Stock added.'})
    },
  )
}

const updateStock = (request, response) => {
  const {product, units} = request.body

  pool.query(
    'UPDATE stock SET units = $2 WHERE product = $1',
    [units, product],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Stock modificado: ${product}`)
    }
  )
}


/*
app
  .route('/stocks')
  // GET endpoint
  .get(getStock)
  // POST endpoint
  .post(addStock)
*/

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/stocks', getStock)
app.get('/stocks/:id', getStockById)
app.post('/stocks', addStock)
app.put('/stocks/:id', updateStock)

// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`)
})
