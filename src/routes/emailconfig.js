// emailConfig.js
const nodemailer = require('nodemailer');

// Configura el transporte de Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tucorreo@gmail.com',
    pass: 'tucontraseña',
  },
});

module.exports = transporter;
