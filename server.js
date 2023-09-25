const express = require('express');
const bodyParser = require('body-parser');
const ProductManager = require('./ProductManager');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const productManager = new ProductManager();

// Ruta para agregar un producto
app.post('/productos', (req, res) => {
  const { title, description, price, thumbnail, code, stock } = req.body;

  try {
    const newProduct = productManager.addProduct(title, description, price, thumbnail, code, stock);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta para obtener la lista de productos
app.get('/productos', (req, res) => {
  const productsList = productManager.getProducts();
  res.json(productsList);
});

// Otras rutas para actualizar y eliminar productos

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
