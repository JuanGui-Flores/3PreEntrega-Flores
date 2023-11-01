const fs = require('fs');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión a MongoDB exitosa');
});


const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
});

const Producto = mongoose.model('Producto', productSchema);

const filePath = 'products.json';

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

// Ruta para cargar la página principal con filtros, paginación y ordenamientos
app.get('/', (req, res) => {
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
app.get('/realtimeproducts', (req, res) => {
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
app.post('/add-product', (req, res) => {
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

// Configurar WebSockets
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Obtener la lista de productos (incluyendo el producto recién agregado)
Producto.find({}, (err, products) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Lista de productos:');
    products.forEach((product) => {
      console.log(product);
    });
  }
});

// Iniciar el servidor HTTP
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
