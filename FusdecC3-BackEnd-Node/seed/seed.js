const mongoose = require("mongoose");
const Rol = require("../models/rol_model");
const Usuario = require("../models/usuario_model");
const bcrypt = require("bcryptjs");

const rolData = {
  nombreRol: "Root",
  estadoRol: true,
};

const usuarioData = {
  nombreUsuario: "Fundacion",
  apellidoUsuario: "Fusdec",
  numeroDocumento: "1234567890",
  correo: "FusdecC3@gmail.com",
  contraseñaHash: bcrypt.hashSync("R00tFusd3ccE", 10), // Hashea la contraseña
  estadoUsuario: true,
  roles: [], // Esto se llenará después de crear el rol
};

async function seedDatabase() {
  try {
    // Crear el rol "Root" si no existe
    let rol = await Rol.findOne({ nombreRol: rolData.nombreRol });
    if (!rol) {
      rol = await Rol.create(rolData);
      console.log(`Rol "${rolData.nombreRol}" creado.`);
    } else {
      console.log(`Rol "${rolData.nombreRol}" ya existe.`);
    }

    // Crear el usuario con el rol "Root" si no existe
    let usuario = await Usuario.findOne({ correo: usuarioData.correo });
    if (!usuario) {
      usuarioData.roles = [rol._id]; // Asocia el rol "Root" al usuario
      usuario = await Usuario.create(usuarioData);
      console.log(`Usuario "${usuarioData.correo}" creado con el rol "Root".`);
    } else {
      console.log(`Usuario "${usuarioData.correo}" ya existe.`);
    }
  } catch (error) {
    console.error("Error al sembrar la base de datos:", error);
  }
}

module.exports = seedDatabase;
