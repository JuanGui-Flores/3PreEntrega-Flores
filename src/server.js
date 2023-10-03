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

app.get('/products', async (req, res) => {
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
app.get('/products/pid', async (req, res) => {
  try {
    const produtId = rew.params.pid;
    const productos = await LockManager.getProducts();
    const productoFilter = productos.filter(
      (producto) => producto.id == produtId
    );
    if (productoFilter.lenght) {
      res.send(productoFilter);
    } else {
      res.send({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Otras rutas para actualizar y eliminar productos
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
