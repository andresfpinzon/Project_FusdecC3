//require('dotenv').config();
const mongoose = require('mongoose');

// Conexión a MongoDB Atlas 
/*
const connectionString = process.env.MONGO_DB_CONNECTION_STRING;

// Conexión a MongoDB Atlas
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conectado a MongoDB Atlas...');
    })
    .catch(err => {
        console.error('No se pudo conectar con MongoDB Atlas...', err);
        process.exit(1); // Termina la aplicación si no se puede conectar
    });
*/

// Conexión a la base de datos MongoDB local (activa)
mongoose.connect('mongodb://localhost:27017/FusdecDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conectado a MongoDB local...');
    })
    .catch(err => {
        console.error('No se pudo conectar con MongoDB local...', err);
        process.exit(1); // Termina la aplicación si no se puede conectar
    });

module.exports = mongoose;

