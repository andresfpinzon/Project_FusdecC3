// Importar rutas para cada modelo
const asistenciaRoutes = require('./routes/asistencia_routes');
const auditoriaRoutes = require('./routes/auditoria_routes');
const brigadaRoutes = require('./routes/brigada_routes');
const calificacionRoutes = require('./routes/calificacion_routes');
const certificadoRoutes = require('./routes/certificado_routes');
const colegioRoutes = require('./routes/colegio_routes');
const comandoRoutes = require('./routes/comando_routes');
const cursoRoutes = require('./routes/curso_routes');
const edicionRoutes = require('./routes/edicion_routes');
const estudianteRoutes = require('./routes/estudiante_routes');
const horarioRoutes = require('./routes/horario_routes');
const inasistenciaRoutes = require('./routes/inasistencia_routes');
const rolRoutes = require('./routes/rol_routes');
const unidadRoutes = require('./routes/unidad_routes');
const usuarioRoutes = require('./routes/usuario_routes');
const authRoutes = require('./routes/auth_routes')
//const fundacionRoutes = require('./routes/fundacion_routes'); 

// Importaciones básicas de Express y otras dependencias
const express = require('express');
const mongoose = require('./config/db_config');
const corsMiddleware = require('./config/cors_config'); 
//const loadRoutes = require('./routesLoader');

// Importar la configuración de Swagger
const { swaggerUi, swaggerDocs } = require('./config/swagger_config');

// Middleware
const app = express();

// Middleware para analizar el cuerpo de las solicitudes JSON
app.use(express.json());

// Aplicar middleware de CORS
app.use(corsMiddleware); 

// Configuración de Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Endpoints (rutas para los modelos)
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/auditorias', auditoriaRoutes);
app.use('/api/brigadas', brigadaRoutes);
app.use('/api/calificaciones', calificacionRoutes);
app.use('/api/certificados', certificadoRoutes);
app.use('/api/colegios', colegioRoutes);
app.use('/api/comandos', comandoRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/ediciones', edicionRoutes);
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/horarios', horarioRoutes);
app.use('/api/inasistencias', inasistenciaRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/unidades', unidadRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('api/auth', authRoutes)
//app.use('/api/fundaciones', fundacionRoutes); 

// Puerto del servidor
const port = process.env.PORT || 3000;

// Iniciar servidor
app.listen(port, () => {
    console.log('Api REST Ok, y ejecutándose...');
    console.log(`Servidor HTTP corriendo en http://localhost:${port}/api-docs`);
});
