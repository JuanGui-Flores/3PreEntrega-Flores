const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Middleware para verificar si el usuario ya está autenticado
const ensureNotAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next(); // Continuar si el usuario no está autenticado
    }
    return res.redirect('/dashboard'); // Redirige a la página de inicio si el usuario ya está autenticado.
};

// Configura la estrategia de autenticación local de Passport.js
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            // Implementa la lógica para verificar las credenciales del usuario en tu base de datos
            const user = await User.findOne({ username });
            if (!user) {
                return done(null, false, { message: 'Usuario incorrecto' });
            }

            // Compara la contraseña ingresada con la contraseña almacenada en la base de datos
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Middleware de sesión de Passport.js
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        // Implementa la lógica para recuperar el usuario de la base de datos por su ID
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', ensureNotAuthenticated, (req, res) => {
    res.render('login', { message: req.flash('loginMessage') }); // Renderiza la vista del formulario de inicio de sesión con un mensaje de retroalimentación si es necesario.
});

// Ruta para procesar la solicitud de inicio de sesión
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard', // Redirige a esta página si la autenticación es exitosa
    failureRedirect: '/login', // Redirige de vuelta al formulario de inicio de sesión si la autenticación falla
    failureFlash: true // Habilita mensajes flash para mostrar errores de autenticación
}));

// Ruta para el cierre de sesión
router.get('/logout', (req, res) => {
    req.logout(); // Utiliza Passport.js para cerrar la sesión
    res.redirect('/login');
});

// Exporta el router
module.exports = router;
