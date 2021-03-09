const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {pool} = require('./config')
const path = require('path');


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use(express.static(__dirname + '/public'));

const getStock = (request, response) => {
  pool.query('SELECT * FROM stock', (error, results) => {
    if (error) {
      throw error
    }

    const data = results.rows;

var result;

    data.forEach(row => {
       result = result + "<\br>" + (`Producto: ${row.product} Unidades: ${row.units}`);
    })

    response.status(200).send(result)
	
    //)

    //response.status(200).json(results.rows)
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
	response.status(201).send(`Stock añadido: ${product} con ${units} unidades`)
    },
  )
}

const updateStock = (request, response) => {
  const {product, units} = request.body

  pool.query(
    'UPDATE stock SET units = $1 WHERE product = $2',
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
app.post('/stocks', addStock)
app.post('/stocks_mod', updateStock)


// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`)
})
