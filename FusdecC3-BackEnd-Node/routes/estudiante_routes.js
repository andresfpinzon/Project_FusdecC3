const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudiante_controllers');

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
 *                   tipoDocumento: "DNI"
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
 *                 tipoDocumento: "DNI"
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
 * /api/estudiantes/{id}/colegio:
 *   post:
 *     tags: 
 *       - Estudiantes
 *     summary: Asignar un colegio a un estudiante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del estudiante
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               colegioId:
 *                 type: string
 *                 description: ID del colegio a asignar
 *           example:
 *             colegioId: "63f7d2bbf1a2b4b5c3cdb700"
 *     responses:
 *       200:
 *         description: Colegio asignado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 *       404:
 *         description: Estudiante no encontrado.
 */
router.post('/estudiantes/:id/colegio', estudianteController.asignarColegioAEstudiante);

/**
 * @swagger
 * /api/estudiantes/{id}/unidad:
 *   post:
 *     tags: 
 *       - Estudiantes
 *     summary: Asignar una unidad a un estudiante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del estudiante
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               unidadId:
 *                 type: string
 *                 description: ID de la unidad a asignar
 *           example:
 *             unidadId: "63f7d2bbf1a2b4b5c3cdb701"
 *     responses:
 *       200:
 *         description: Unidad asignada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 *       404:
 *         description: Estudiante no encontrado.
 */
router.post('/estudiantes/:id/unidad', estudianteController.asignarUnidadAEstudiante);

/**
 * @swagger
 * /api/estudiantes/{id}/ediciones:
 *   post:
 *     tags: 
 *       - Estudiantes
 *     summary: Asignar ediciones a un estudiante
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del estudiante
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               edicionesIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs de las ediciones a asignar
 *           example:
 *             edicionesIds: ["63f7d2bbf1a2b4b5c3cdb702", "63f7d2bbf1a2b4b5c3cdb703"]
 *     responses:
 *       200:
 *         description: Ediciones asignadas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Estudiante'
 *       404:
 *         description: Estudiante no encontrado.
 */
router.post('/estudiantes/:id/ediciones', estudianteController.asignarEdicionesAEstudiante);

/**
 * @swagger
 * /api/estudiantes/asistencia:
 *   post:
 *     tags: 
 *       - Estudiantes
 *     summary: Agregar asistencia a un estudiante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estudianteId:
 *                 type: string
 *               asistenciaId:
 *                 type: string
 *           example:
 *             estudianteId: "63f7d2bbf1a2b4b5c3cdb704"
 *             asistenciaId: "63f7d2bbf1a2b4b5c3cdb705"
 *     responses:
 *       200:
 *         description: Asistencia agregada correctamente.
 */
router.post('/estudiantes/:id/asistencias', estudianteController.agregarAsistenciaAEstudiante);

/**
 * @swagger
 * /api/estudiantes/inasistencia:
 *   post:
 *     tags: 
 *       - Estudiantes
 *     summary: Agregar inasistencia a un estudiante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estudianteId:
 *                 type: string
 *               inasistenciaId:
 *                 type: string
 *           example:
 *             estudianteId: "63f7d2bbf1a2b4b5c3cdb706"
 *             inasistenciaId: "63f7d2bbf1a2b4b5c3cdb707"
 *     responses:
 *       200:
 *         description: Inasistencia agregada correctamente.
 */
router.post('/estudiantes/:id/inasistencias', estudianteController.agregarInasistenciaAEstudiante);

/**
 * @swagger
 * /api/estudiantes/calificacion:
 *   post:
 *     tags: 
 *       - Estudiantes
 *     summary: Agregar calificación a un estudiante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estudianteId:
 *                 type: string
 *               calificacionId:
 *                 type: string
 *           example:
 *             estudianteId: "63f7d2bbf1a2b4b5c3cdb708"
 *             calificacionId: "63f7d2bbf1a2b4b5c3cdb709"
 *     responses:
 *       200:
 *         description: Calificación agregada correctamente.
 */
router.post('/estudiantes/:id/calificaciones', estudianteController.agregarCalificacionAEstudiante);

/**
 * @swagger
 * /api/estudiantes/certificado:
 *   post:
 *     tags: 
 *       - Estudiantes
 *     summary: Agregar un certificado a un estudiante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estudianteId:
 *                 type: string
 *               certificadoId:
 *                 type: string
 *           example:
 *             estudianteId: "63f7d2bbf1a2b4b5c3cdb710"
 *             certificadoId: "63f7d2bbf1a2b4b5c3cdb711"
 *     responses:
 *       200:
 *         description: Certificado agregado correctamente.
 */
router.post('/estudiantes/:id/certificados', estudianteController.agregarCertificadoAEstudiante);

module.exports = router;
