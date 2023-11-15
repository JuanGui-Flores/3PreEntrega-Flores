const fs = require('fs');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const initDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const authRoutes = require('./routes/auth');

initDB();

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
