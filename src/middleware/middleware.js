// middleware.js
const currentMiddleware = (req, res, next) => {
    // Realiza alguna acción antes de pasar la solicitud al controlador
    console.log('Middleware: Realizando alguna acción antes del controlador');

    // Puedes acceder y modificar datos en la solicitud (req) si es necesario
    req.customData = 'Información personalizada del middleware';

    // Llama a next() para pasar la solicitud al siguiente middleware o controlador
    next();
};

module.exports = currentMiddleware;
