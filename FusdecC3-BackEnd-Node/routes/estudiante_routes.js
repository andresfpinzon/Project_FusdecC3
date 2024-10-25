const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudiante_controllers');
//const { verifyJWT, verifyRole } = require('../config/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Estudiante:
 *       type: object
 *       required:
 *         - nombreEstudiante
 *         - apellidoEstudiante
 *         - correoEstudiante
 *         - tipoDocumento
 *         - numeroDocumento
 *         - fechaNacimiento
 *         - generoEstudiante
 *         - unidadId
 *         - colegioId
 *         - estadoEstudiante
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado del estudiante.
 *         nombreEstudiante:
 *           type: string
 *           description: Nombre del estudiante.
 *         apellidoEstudiante:
 *           type: string
 *           description: Apellido del estudiante.
 *         correoEstudiante:
 *           type: string
 *           description: Correo electrónico del estudiante.
 *         tipoDocumento:
 *           type: string
 *           description: Tipo de documento del estudiante.
 *         numeroDocumento:
 *           type: string
 *           description: Número de documento del estudiante.
 *         fechaNacimiento:
 *           type: string
 *           format: date
 *           description: Fecha de nacimiento del estudiante.
 *         generoEstudiante:
 *           type: string
 *           description: Género del estudiante.
 *         unidadId:
 *           type: string
 *           description: ID de la unidad a la que pertenece el estudiante.
 *         colegioId:
 *           type: string
 *           description: ID del colegio al que pertenece el estudiante.
 *         estadoEstudiante:
 *           type: boolean
 *           description: Estado del estudiante (activo/inactivo).
 *           default: true
 */

/**
 * @swagger
 * tags:
 *   - name: Estudiantes
 *     description: API para gestionar estudiantes
 */

/**
 * @swagger
 * /api/estudiantes:
 *   get:
 *     tags:
 *       - Estudiantes
 *     summary: Obtener una lista de estudiantes
 *     responses:
 *       200:
 *         description: Una colección de estudiantes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Estudiante'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   - id: "61f7d2bbf1a2b4b5c3cdb71d"
 *                     nombreEstudiante: "Juan"
 *                     apellidoEstudiante: "Pérez"
 *                     correoEstudiante: "juan.perez@example.com"
 *                     tipoDocumento: "DNI"
 *                     numeroDocumento: "12345678"
 *                     fechaNacimiento: "2000-01-01"
 *                     generoEstudiante: "Masculino"
 *                     unidadId: "unidad123"
 *                     colegioId: "colegio456"
 *                     estadoEstudiante: true
 */
router.get('/', estudianteController.listarEstudiantes);

/**
 * @swagger
 * /api/estudiantes:
 *   post:
 *     tags:
 *       - Estudiantes
 *     summary: Crear un estudiante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Estudiante'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 nombreEstudiante: "Carlos"
 *                 apellidoEstudiante: "Ramírez"
 *                 correoEstudiante: "carlos.ramirez@example.com"
 *                 tipoDocumento: "DNI"
 *                 numeroDocumento: "87654321"
 *                 fechaNacimiento: "1998-05-12"
 *                 generoEstudiante: "Masculino"
 *                 unidadId: "unidad123"
 *                 colegioId: "colegio789"
 *                 estadoEstudiante: true
 *     responses:
 *       201:
 *         description: Estudiante creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71e"
 *                   nombreEstudiante: "Carlos"
 *                   apellidoEstudiante: "Ramírez"
 *                   correoEstudiante: "carlos.ramirez@example.com"
 *                   tipoDocumento: "T.I"
 *                   numeroDocumento: "87654321"
 *                   fechaNacimiento: "1998-05-12"
 *                   generoEstudiante: "Masculino"
 *                   unidadId: "unidad123"
 *                   colegioId: "colegio789"
 *                   estadoEstudiante: true
 */
router.post('/', estudianteController.crearEstudiante);

/**
 * @swagger
 * /api/estudiantes/{id}:
 *   put:
 *     tags:
 *       - Estudiantes
 *     summary: Actualizar un estudiante mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del estudiante a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Estudiante'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 nombreEstudiante: "Carlos"
 *                 apellidoEstudiante: "Ramírez"
 *                 correoEstudiante: "carlos.ramirez@example.com"
 *                 tipoDocumento: "T.I"
 *                 numeroDocumento: "87654321"
 *                 fechaNacimiento: "1998-05-12"
 *                 generoEstudiante: "Masculino"
 *                 unidadId: "unidad123"
 *                 colegioId: "colegio789"
 *                 estadoEstudiante: true
 *     responses:
 *       200:
 *         description: Estudiante actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 *       404:
 *         description: Estudiante no encontrado.
 */
router.put('/:id', estudianteController.actualizarEstudiante);

/**
 * @swagger
 * /api/estudiantes/{id}:
 *   delete:
 *     tags:
 *       - Estudiantes
 *     summary: Desactivar un estudiante mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del estudiante a desactivar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estudiante desactivado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 *       404:
 *         description: Estudiante no encontrado.
 */
router.delete('/:id', estudianteController.desactivarEstudiante);

/**
 * @swagger
 * /api/estudiantes/{id}:
 *   get:
 *     tags:
 *       - Estudiantes
 *     summary: Obtener un estudiante mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del estudiante.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estudiante obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 *       404:
 *         description: Estudiante no encontrado.
 */
router.get('/:id', estudianteController.obtenerEstudiantePorId);

/**
 * @swagger
 * /api/estudiantes/{id}/asistencias:
 *   post:
 *     tags:
 *       - Estudiantes
 *     summary: Agregar asistencias a un estudiante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del estudiante al que se le agregarán las asistencias.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               asistencias:
 *                 type: array
 *                 items:
 *                   type: string
 *           examples:
 *             ejemplo1:
 *               value:
 *                 asistencias: [
 *                   "60d21b4667d0d8992e610c81", // ID de asistencia 1
 *                   "60d21b4667d0d8992e610c82"  // ID de asistencia 2
 *                 ]
 *     responses:
 *       200:
 *         description: Asistencias agregadas correctamente al estudiante.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   _id: "60d21b4667d0d8992e610c84"
 *                   nombreEstudiante: "Juan"
 *                   apellidoEstudiante: "Pérez"
 *                   correoEstudiante: "juan.perez@gmail.com"
 *                   asistencias: [
 *                     "60d21b4667d0d8992e610c81",
 *                     "60d21b4667d0d8992e610c82"
 *                   ]
 */
router.post('/:id/asistencias', estudianteController.agregarAsistenciaAEstudiante);

/**
 * @swagger
 * /api/estudiantes/{id}/inasistencias:
 *   post:
 *     tags:
 *       - Estudiantes
 *     summary: Agregar inasistencias a un estudiante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del estudiante al que se le agregarán las inasistencias.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inasistencias:
 *                 type: array
 *                 items:
 *                   type: string
 *           examples:
 *             ejemplo1:
 *               value:
 *                 inasistencias: [
 *                   "60d21b4667d0d8992e610c83", // ID de inasistencia 1
 *                   "60d21b4667d0d8992e610c84"  // ID de inasistencia 2
 *                 ]
 *     responses:
 *       200:
 *         description: Inasistencias agregadas correctamente al estudiante.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   _id: "60d21b4667d0d8992e610c84"
 *                   nombreEstudiante: "Juan"
 *                   apellidoEstudiante: "Pérez"
 *                   correoEstudiante: "juan.perez@gmail.com"
 *                   inasistencias: [
 *                     "60d21b4667d0d8992e610c83",
 *                     "60d21b4667d0d8992e610c84"
 *                   ]
 */
router.post('/:id/inasistencias', estudianteController.agregarInasistenciaAEstudiante);

/**
 * @swagger
 * /api/estudiantes/{id}/certificados:
 *   post:
 *     tags:
 *       - Estudiantes
 *     summary: Agregar certificados a un estudiante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del estudiante al que se le agregarán los certificados.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               certificados:
 *                 type: array
 *                 items:
 *                   type: string
 *           examples:
 *             ejemplo1:
 *               value:
 *                 certificados: [
 *                   "60d21b4667d0d8992e610c85", // ID de certificado 1
 *                   "60d21b4667d0d8992e610c86"  // ID de certificado 2
 *                 ]
 *     responses:
 *       200:
 *         description: Certificados agregados correctamente al estudiante.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   _id: "60d21b4667d0d8992e610c84"
 *                   nombreEstudiante: "Juan"
 *                   apellidoEstudiante: "Pérez"
 *                   correoEstudiante: "juan.perez@gmail.com"
 *                   certificados: [
 *                     "60d21b4667d0d8992e610c85",
 *                     "60d21b4667d0d8992e610c86"
 *                   ]
 */
router.post('/:id/certificados', estudianteController.agregarCertificadoAEstudiante);

/**
 * @swagger
 * /api/estudiantes/{id}/calificaciones:
 *   post:
 *     tags:
 *       - Estudiantes
 *     summary: Agregar calificaciones a un estudiante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del estudiante al que se le agregarán las calificaciones.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               calificaciones:
 *                 type: array
 *                 items:
 *                   type: string
 *           examples:
 *             ejemplo1:
 *               value:
 *                 calificaciones: [
 *                   "60d21b4667d0d8992e610c91", // ID de calificación 1
 *                   "60d21b4667d0d8992e610c92"  // ID de calificación 2
 *                 ]
 *     responses:
 *       200:
 *         description: Calificaciones agregadas correctamente al estudiante.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   _id: "60d21b4667d0d8992e610c84"
 *                   nombreEstudiante: "Juan"
 *                   apellidoEstudiante: "Pérez"
 *                   correoEstudiante: "juan.perez@gmail.com"
 *                   calificaciones: [
 *                     "60d21b4667d0d8992e610c91",
 *                     "60d21b4667d0d8992e610c92"
 *                   ]
 */
router.post('/:id/calificaciones', estudianteController.agregarCalificacionAEstudiante);

/**
 * @swagger
 * /api/estudiantes/{id}/ediciones:
 *   post:
 *     tags:
 *       - Estudiantes
 *     summary: Agregar ediciones a un estudiante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del estudiante al que se le agregarán las ediciones.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ediciones:
 *                 type: array
 *                 items:
 *                   type: string
 *           examples:
 *             ejemplo1:
 *               value:
 *                 ediciones: [
 *                   "60d21b4667d0d8992e610c93", // ID de edición 1
 *                   "60d21b4667d0d8992e610c94"  // ID de edición 2
 *                 ]
 *     responses:
 *       200:
 *         description: Ediciones agregadas correctamente al estudiante.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   _id: "60d21b4667d0d8992e610c84"
 *                   nombreEstudiante: "Juan"
 *                   apellidoEstudiante: "Pérez"
 *                   correoEstudiante: "juan.perez@gmail.com"
 *                   ediciones: [
 *                     "60d21b4667d0d8992e610c93",
 *                     "60d21b4667d0d8992e610c94"
 *                   ]
 */
router.post('/:id/ediciones', estudianteController.agregarEdicionAEstudiante);


module.exports = router;
