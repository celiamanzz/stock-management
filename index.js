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

const updateStock = (request, response) => {
  const id = parseInt(request.params.id)
  const { producto, precio, unidades } = request.body

  pool.query(
    'UPDATE stock SET producto = $1, precio_unidad = $2, num_unidades = $3 WHERE id = $4',
    [producto, precio, unidades, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Stock modified with ID: ${id}`)
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


app.get('/stocks', getStock)
app.get('/stocks/:id', getStockById)
app.post('/stocks', addStock)
app.put('/stocks/:id', updateStock)

// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`)
})
