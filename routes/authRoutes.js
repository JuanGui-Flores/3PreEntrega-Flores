const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Asegúrate de tener un modelo de usuario definido

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login'); // Renderiza la vista del formulario de inicio de sesión
});

// Ruta para procesar la solicitud de inicio de sesión
router.post('/login', passport.authenticate('local', {
  successRedirect: '/productos', // Redirige a la vista de productos si la autenticación es exitosa
  failureRedirect: '/login',
  failureFlash: true
}));

// Ruta para mostrar el formulario de registro
router.get('/register', (req, res) => {
  res.render('register'); // Renderiza la vista del formulario de registro
});

// Ruta para procesar la solicitud de registro
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Verifica si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash('error', 'El nombre de usuario ya está en uso');
      return res.redirect('/register');
    }

    // Hashea la contraseña antes de almacenarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);
    // Crea un nuevo usuario en la base de datos
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Inicia sesión automáticamente después del registro
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/dashboard');
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error en el registro');
    res.redirect('/register');
  }
});

// Ruta para el cierre de sesión
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
