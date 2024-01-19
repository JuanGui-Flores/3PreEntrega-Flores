const fs = require("fs");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const initDB = require("./config/db");
const authRouter = require("./routes/authRouter");
const userRoutes = require("./routes/users");
const UserController = require("../controllers/userController");
const currentMiddleware = require("./middleware/middleware");
const transporter = require("./emailConfig");
const nodemailer = require("nodemailer");
const UsuarioFactory = require('./factories/UsuarioFactory');
const Ticket = require('./models/Ticket');
const crypto = require('crypto');
const Usuario = require('./models/Usuario');



initDB();

mongoose.connect("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", () => {
  console.log("Conexión a MongoDB exitosa");
});

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
});

const Producto = mongoose.model("Producto", productSchema);

const filePath = "products.json";

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configuración de Passport
passport.use(
  new LocalStrategy((username, password, done) => {
    // Aquí debes verificar las credenciales del usuario en tu base de datos
    // Replace the following line with your actual user authentication logic
    if (username === "admin" && password === "admin") {
      return done(null, { id: 1, username: "admin" });
    } else {
      return done(null, false, { message: "Credenciales incorrectas" });
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Aquí debes buscar al usuario en tu base de datos
  // Replace the following line with your actual user lookup logic
  const user = { id: 1, username: "admin" };
  done(null, user);
});

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(bodyParser.json());

// Configuración de session para Passport
app.use(
  session({
    secret: "tu_secreto", // Cambia esto a una cadena secreta más segura
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Configurar WebSockets
io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

// Obtener la lista de productos (incluyendo el producto recién agregado)
Producto.find({}, (err, products) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Lista de productos:");
    products.forEach((product) => {
      console.log(product);
    });
  }
});

// Rutas de autenticación
app.use("/auth", authRouter);

// Rutas de usuarios con el middleware
app.use("/users", currentMiddleware, userRoutes);

//mail
app.get("/mail", async (req, res) => {
  let result = await transporter.sendMail({
    from:'Coder tests <juanguiflores2002@gmail.com>',
    to:'correo donde se enviará',
    subject:'correo test',
    html:
    <div>
        <h1>'Esto es un test'</h1>
    </div>
    ,
    attachments:{}
  });
});

// Configura el transporte de Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tucorreo@gmail.com",
    pass: "tucontraseña",
  },
});

// Uso de la Factory con DTO
const usuarioFactory = new UsuarioFactory();
const usuarioDTO = usuarioFactory.crearUsuarioDTO("aaaa", "aaaa@ejemplo.com");


// Crear un nuevo Ticket
const nuevoTicket = new Ticket({
  amount: 100.50, // Cambia el valor según tu caso
  purchaser: 'usuario@example.com' // Cambia el valor según tu caso
});

// Guardar el Ticket en la base de datos
nuevoTicket.save()
    .then(ticket => {
        console.log('Ticket creado con éxito:', ticket);
        // Puedes realizar acciones adicionales después de guardar el ticket
    })
    .catch(error => {
        console.error('Error al crear el Ticket:', error);
    });


    // Ruta para solicitar recuperación de contraseña
app.post('/recuperar-contrasena', async (req, res) => {
  const { email } = req.body;

  try {
    // Verificar si el correo existe en la base de datos
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ message: 'Correo electrónico no encontrado' });
    }

    // Generar un token único y guardarlo en el usuario
    const token = crypto.randomBytes(20).toString('hex');
    usuario.resetToken = token;
    usuario.resetTokenExpiracion = Date.now() + 3600000; // Expira en 1 hora

    // Guardar el token en la base de datos
    await usuario.save();

    // Enviar un correo con el enlace de recuperación
    const resetURL = `http://localhost:3000/reset/${token}`; // Reemplaza con tu URL de producción
    await transporter.sendMail({
      to: email,
      subject: 'Recuperación de Contraseña',
      html: `Haz clic <a href="${resetURL}">aquí</a> para restablecer tu contraseña.`,
    });

    res.json({ message: 'Correo de recuperación enviado con éxito.' });
  } catch (error) {
    console.error('Error al solicitar recuperación de contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta para la página de cambio de contraseña
app.get('/reset/:token', async (req, res) => {
  const { token } = req.params;

  try {
    // Buscar al usuario con el token proporcionado
    const usuario = await Usuario.findOne({
      resetToken: token,
      resetTokenExpiracion: { $gt: Date.now() },
    });

    if (!usuario) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    // Renderizar la página de cambio de contraseña
    res.render('reset', { token });
  } catch (error) {
    console.error('Error al procesar la página de cambio de contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta para cambiar la contraseña
app.post('/reset/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  try {
    // Buscar al usuario con el token proporcionado
    const usuario = await Usuario.findOne({
      resetToken: token,
      resetTokenExpiracion: { $gt: Date.now() }, // Verificar que el token no haya expirado
    });

    if (!usuario) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    // Verificar que la nueva contraseña no sea la misma que la antigua
    if (newPassword === usuario.password) {
      return res.redirect(`/reset/${token}?error=La nueva contraseña no puede ser la misma que la anterior`);
    }

    // Restablecer la contraseña del usuario con la nueva contraseña
    usuario.password = newPassword;

    // Limpiar el token de recuperación
    usuario.resetToken = undefined;
    usuario.resetTokenExpiracion = undefined;

    // Guardar el usuario actualizado en la base de datos
    await usuario.save();

    res.json({ message: 'Contraseña restablecida con éxito.' });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Ruta para manejar enlaces expirados
app.get('/reset-expirado', (req, res) => {
  res.render('reset-expirado');
});


// Ruta para regenerar el correo de restablecimiento
app.post('/regenerar-correo', async (req, res) => {
  try {
    // Buscar al usuario con el token proporcionado
    const usuario = await Usuario.findOne({
      resetToken: token,
      resetTokenExpiracion: { $gt: Date.now() },
    });

  try {
    // Lógica para generar un nuevo token y enviar el correo
    const token = crypto.randomBytes(20).toString('hex');
    usuario.resetToken = token;
    usuario.resetTokenExpiracion = Date.now() + 3600000; // Expira en 1 hora

    await usuario.save();

    const resetURL = `http://localhost:3000/reset/${token}`; // Reemplaza con tu URL de producción
    await transporter.sendMail({
      to: usuario.email,
      subject: 'Recuperación de Contraseña',
      html: `Haz clic <a href="${resetURL}">aquí</a> para restablecer tu contraseña.`,
    });

    res.json({ message: 'Nuevo correo de recuperación enviado con éxito.' });
  } catch (error) {
    console.error('Error al regenerar el correo de recuperación:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


// Iniciar el servidor HTTP
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
