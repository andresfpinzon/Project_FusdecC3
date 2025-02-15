const mongoose = require("mongoose");
const Usuario = require("../models/usuario_model");
const bcrypt = require("bcryptjs");
const {ERoles} = require('../enums/rolesEnum');
require("dotenv").config(); // Carga las variables de entorno


async function seedDatabase() {
  try {
    // Verifica si ya existe un usuario root
    const existeRoot = await Usuario.findOne({ roles: ERoles.Root });
    if (existeRoot) {
      console.log("El usuario Root ya existe.");
      return;
    }

    // Obtener correo y contraseña desde las variables de entorno
    const correoRoot = process.env.ROOT_EMAIL;
    const contraseñaRoot = process.env.ROOT_PASSWORD;

    if (!correoRoot || !contraseñaRoot) {
      console.error("Error: Faltan variables de entorno ROOT_EMAIL o ROOT_PASSWORD.");
      return;
    }

    // Hash de la contraseña
    const contraseñaHash = await bcrypt.hash(contraseñaRoot, 10);

    // Crea el usuario Root
    const usuarioRoot = new Usuario({
      nombreUsuario: "Fundacion",
      apellidoUsuario: "Fusdec",
      numeroDocumento: "123456789",
      correo: correoRoot,
      password: contraseñaHash,
      roles: [ERoles.Root], 
    });

    await usuarioRoot.save();
    console.log("Usuario Root creado exitosamente.");
  } catch (error) {
    console.error("Error al crear el usuario Root:", error);
  }
}

module.exports = seedDatabase;

