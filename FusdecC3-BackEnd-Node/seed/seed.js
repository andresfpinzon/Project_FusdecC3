const mongoose = require("mongoose");
const Usuario = require("../models/usuario_model");
const bcrypt = require("bcryptjs");
const {ERoles} = require('../enums/rolesEnum');



const usuarioData = {
  nombreUsuario: "Fundacion",
  apellidoUsuario: "Fusdec",
  numeroDocumento: "1234567890",
  correo: "FusdecC3@gmail.com",
  password: bcrypt.hashSync("R00tFusd3ccE", 10), // Hashea la contraseña
  roles:[ERoles.Admin]
};

async function seedDatabase() {
  try {
    // // Crear los roles si no existen
    // const createdRoles = [];
    // for (const rolData of rolesData) {
    //   let rol = await Rol.findOne({ nombreRol: rolData.nombreRol });
    //   if (!rol) {
    //     rol = await Rol.create(rolData);
    //     console.log(`Rol "${rolData.nombreRol}" creado.`);
    //   } else {
    //     console.log(`Rol "${rolData.nombreRol}" ya existe.`);
    //   }
    //   createdRoles.push(rol);
    // }

    // Asociar el rol "Root" al usuario por defecto si no existe
    let usuario = await Usuario.findOne({ correo: usuarioData.correo });
    if (!usuario) {
        //usuarioData.roles = [rootRole._id]; // Asocia el rol "Root" al usuario
        usuario = await Usuario.create(usuarioData);
        console.log(`Usuario "${usuarioData.correo}" creado".`);
      
    } else {
      console.log(`Usuario "${usuarioData.correo}" ya existe.`);
    }
  } catch (error) {
    console.error("Error al sembrar la base de datos:", error);
  }
}

module.exports = seedDatabase;

