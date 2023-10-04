const express = require('express');
const bodyParser = require('body-parser');
const ProductManager = require('./ProductManager');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const productManager = new ProductManager();
const cartManager = new CartManager();
const productsRouter = express.Router();

// Ruta para agregar un producto
productsRouter.post('/', (req, res) => {
  const { title, description, price, thumbnail, code, stock } = req.body;

  try {
    const newProduct = productManager.addProduct(title, description, price, thumbnail, code, stock);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
    productsRouter.post('/', (req, res) => {

  }
});

productsRouter.get('/', async (req, res) => {
  try {
    const { limit } = req.query;
    let data;
    if (!limit) {
      data = await LockManager.getProducts();

    } else {
      data = await LockManager.getProducts().slice(0, limit);
    }
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Ruta la cual recibe por req.params el producto id y devolver solo ese producto
app.get('/products/:pid', async (req, res) => { // Corregimos la ruta y el parámetro
  try {
    const productId = req.params.pid; // Corregimos la variable
    const productos = await LockManager.getProducts();
    const productoFilter = productos.filter(
      (producto) => producto.id == productId
    );
    if (productoFilter.length) {
      res.send(productoFilter);
    } else {
      res.send({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.use('/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});