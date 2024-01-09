// UsuarioFactory.js
const Usuario = require('./models/Usuario');
const UsuarioDTO = require('./dtos/UsuarioDTO');

class UsuarioFactory {
    crearUsuarioDTO(nombre, correo) {
        // Puedes realizar lógica adicional aquí, si es necesario
        const usuario = new Usuario(nombre, correo);
        return this.mapUsuarioToDTO(usuario);
    }

    mapUsuarioToDTO(usuario) {
        // Mapeo de los datos de Usuario a UsuarioDTO
        return new UsuarioDTO(usuario.nombre, usuario.correo);
    }
}

module.exports = UsuarioFactory;
