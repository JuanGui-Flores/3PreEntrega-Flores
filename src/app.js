const fs = require('fs');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const ProductManager = require('./ProductManager');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const filePath = 'products.json';

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Configurar el uso de bodyParser para analizar JSON
app.use(bodyParser.json());

// Crear una instancia de ProductManager
const productManager = new ProductManager();

// Ruta para cargar la página principal
app.get('/', (req, res) => {
  const productsList = productManager.getProducts();
  res.render('index', { productsList });
});

// Ruta para agregar un producto mediante un formulario
app.post('/add-product', (req, res) => {
  const newProduct = productManager.addProduct(
    "Producto Prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc1223t34t3",
    25
  );
  
  productManager.addProduct(
    "Producto Prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc12ewer3",
    25
  );
  
  productManager.addProduct(
    "Producto Prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc12werwr3",
    25
  );
  
  productManager.addProduct(
    "Producto Prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc12werw3",
    25
  );
  
  productManager.addProduct(
    "Producto Prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc12ewett3",
    25
  );
  
  productManager.addProduct(
    "Producto Prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc12444tgg3",
    25
  );

  // Emitir evento a través de WebSocket
  io.emit('productAdded', newProduct);

  res.redirect('/');
});

// Configurar WebSockets
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Obtener la lista de productos (incluyendo el producto recién agregado)
const productsList = productManager.getProducts();

// Ver la lista de productos
console.log("Lista de productos:");
productsList.forEach((product) => {
  console.log(product);
});

// Iniciar el servidor HTTP
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
