const express = require('express');
const router = express.Router();
const ProductManager = require('./src/dao/models/ProductManager.js');

// Ruta para cargar la página principal con filtros, paginación y ordenamientos
router.get('/', (req, res) => {
  const { filter, page, limit, sortField, sortOrder } = req.query;

  // Construye un objeto de filtros basado en las consultas
  const filters = {};
  if (filter) {
    filters.title = { $regex: filter, $options: 'i' }; // Búsqueda de texto insensible a mayúsculas y minúsculas
    // Agrega más campos de filtro según sea necesario
  }

  // Opciones de paginación y ordenamiento
  const options = {
    skip: (page - 1) * limit,
    limit: limit,
    sort: { [sortField]: sortOrder === 'desc' ? -1 : 1 },
  };

  // Realiza la consulta a la base de datos con filtros, paginación y ordenamiento
  Producto.find(filters, null, options, (err, products) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al obtener productos');
    } else {
      res.render('home', { productsList: products });
    }
  });
});

// Ruta para mostrar la vista de productos en tiempo real
router.get('/realtimeproducts', (req, res) => {
  // Agrega funcionalidad similar a la ruta principal para permitir filtros, paginación y ordenamientos
  Producto.find({}, (err, products) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al obtener productos');
    } else {
      res.render('realTimeProducts', { productsList: products });
    }
  });
});

// Ruta para agregar un producto mediante un formulario
router.post('/add-product', (req, res) => {
  const newProduct = new Producto({
    title: 'Producto Prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc1223t34t3',
    stock: 25,
  });

  newProduct.save((err, product) => {
    if (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    } else {
      // Emitir evento a través de WebSocket
      io.emit('productAdded', product);
      res.redirect('/');
    }
  });
});

module.exports = router;