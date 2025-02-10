const express = require('express');
const router = express.Router();
const inasistenciaController = require('../controllers/inasistencia_controllers'); 
const { verifyJWT, verifyRole } = require('../config/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Inasistencia:
 *       type: object
 *       required:
 *         - tituloInasistencia
 *         - observacion
 *         - usuarioId
 *         - asistenciaId
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado de la inasistencia.
 *         tituloInasistencia:
 *           type: string
 *           description: Título de la inasistencia.
 *         observacion:
 *           type: string
 *           description: Observación sobre la inasistencia.
 *         usuarioId:
 *           type: string
 *           description: ID del usuario que gestiona la inasistencia.
 *         asistenciaId:
 *           type: string
 *           description: ID de la asistencia relacionada.
 *         estadoInasistencia:
 *           type: boolean
 *           description: Estado de la inasistencia (activa/inactiva).
 *           default: true
 *         estudiantes:
 *           type: array
 *           items:
 *             type: string
 *             description: IDs de los estudiantes que no asistieron.
 */

/**
 * @swagger
 * tags:
 *   - name: Inasistencias
 *     description: API para gestionar inasistencias
 */

/**
 * @swagger
 * /api/inasistencias:
 *   get:
 *     tags: 
 *       - Inasistencias
 *     summary: Obtener una lista de inasistencias activas
 *     responses:
 *       200:
 *         description: Una colección de inasistencias activas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inasistencia'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   - id: "62d8d3b7e4c3e4a5c3cb7611"
 *                     tituloInasistencia: "Inasistencia 17/10/2024"
 *                     observacion: "Estudiante enfermo"
 *                     usuarioId: "usuario123"
 *                     asistenciaId: "asistencia123"
 *                     estadoInasistencia: true
 *                     estudiantes: ["estudiante1", "estudiante2"]
 */
router.get('/', verifyJWT, verifyRole(['Instructor','Administrador', 'Root']), inasistenciaController.listarInasistencias);

/**
 * @swagger
 * /api/inasistencias:
 *   post:
 *     tags: 
 *       - Inasistencias
 *     summary: Crear una inasistencia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inasistencia'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 tituloInasistencia: "Inasistencia 18/10/2024"
 *                 observacion: "Estudiante de viaje"
 *                 usuarioId: "usuario456"
 *                 asistenciaId: "asistencia456"
 *                 estadoInasistencia: true
 *                 estudiantes: ["estudiante3", "estudiante4"]
 *     responses:
 *       201:
 *         description: Inasistencia creada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inasistencia'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "62d8d3b7e4c3e4a5c3cb7612"
 *                   tituloInasistencia: "Inasistencia 18/10/2024"
 *                   observacion: "Estudiante de viaje"
 *                   usuarioId: "usuario456"
 *                   asistenciaId: "asistencia456"
 *                   estadoInasistencia: true
 *                   estudiantes: ["estudiante3", "estudiante4"]
 */
router.post('/', verifyJWT, verifyRole(['Instructor', 'Root']), inasistenciaController.crearInasistencia);

/**
 * @swagger
 * /api/inasistencias/{id}:
 *   put:
 *     tags: 
 *       - Inasistencias
 *     summary: Actualizar una inasistencia mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la inasistencia a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inasistencia'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 tituloInasistencia: "Inasistencia 18/10/2024"
 *                 observacion: "Estudiante de viaje"
 *                 usuarioId: "usuario456"
 *                 asistenciaId: "asistencia456"
 *                 estadoInasistencia: true
 *                 estudiantes: ["estudiante5", "estudiante6"]
 *     responses:
 *       200:
 *         description: Inasistencia actualizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inasistencia'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "62d8d3b7e4c3e4a5c3cb7613"
 *                   tituloInasistencia: "Inasistencia 18/10/2024"
 *                   observacion: "Estudiante de viaje"
 *                   usuarioId: "usuario456"
 *                   asistenciaId: "asistencia456"
 *                   estadoInasistencia: true
 *                   estudiantes: ["estudiante5", "estudiante6"]
 *       404:
 *         description: Inasistencia no encontrada.
 */
router.put('/:id', verifyJWT, verifyRole(['Instructor', 'Root']), inasistenciaController.actualizarInasistencia);

/**
 * @swagger
 * /api/inasistencias/{id}:
 *   delete:
 *     tags: 
 *       - Inasistencias
 *     summary: Desactivar una inasistencia mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la inasistencia a desactivar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inasistencia desactivada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inasistencia'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "62d8d3b7e4c3e4a5c3cb7614"
 *                   tituloInasistencia: "Inasistencia 18/10/2024"
 *                   observacion: "Estudiante de viaje"
 *                   usuarioId: "usuario456"
 *                   asistenciaId: "asistencia456"
 *                   estadoInasistencia: false
 *                   estudiantes: []
 *       404:
 *         description: Inasistencia no encontrada.
 */
router.delete('/:id', verifyJWT, verifyRole(['Instructor', 'Root']), inasistenciaController.desactivarInasistencia);

/**
 * @swagger
 * /api/inasistencias/{id}:
 *   get:
 *     tags: 
 *       - Inasistencias
 *     summary: Obtener una inasistencia mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la inasistencia
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inasistencia obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inasistencia'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "62d8d3b7e4c3e4a5c3cb7615"
 *                   tituloInasistencia: "Inasistencia 18/10/2024"
 *                   observacion: "Estudiante de viaje"
 *                   usuarioId: "usuario456"
 *                   asistenciaId: "asistencia456"
 *                   estadoInasistencia: true
 *                   estudiantes: ["estudiante3", "estudiante4"]
 *       404:
 *         description: Inasistencia no encontrada.
 */
router.get('/:id', verifyJWT, verifyRole(['Instructor','Administrador', 'Root']), inasistenciaController.obtenerInasistenciaPorId);

module.exports = router;
