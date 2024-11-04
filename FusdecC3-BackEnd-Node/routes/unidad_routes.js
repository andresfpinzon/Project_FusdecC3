const express = require('express');
const unidadControllers = require('../controllers/unidad_controllers'); // Importa el controlador
const router = express.Router(); // Define el enrutador
const { verifyJWT, verifyRole } = require('../config/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Unidad:
 *       type: object
 *       required:
 *         - nombreUnidad
 *         - estadoUnidad
 *         - brigadaId
 *         - usuarioId
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado de la unidad.
 *         nombreUnidad:
 *           type: string
 *           description: Nombre de la unidad.
 *         estadoUnidad:
 *           type: boolean
 *           description: Estado de la unidad (activo/inactivo).
 *           default: true
 *         brigadaId:
 *           type: object
 *           description: Información de la brigada a la que pertenece la unidad.
 *           properties:
 *             _id:
 *               type: string
 *               description: ID de la brigada.
 *             nombre:
 *               type: string
 *               description: Nombre de la brigada.
 *         usuarioId:
 *           type: object
 *           description: Información del usuario responsable de la unidad.
 *           properties:
 *             _id:
 *               type: string
 *               description: ID del usuario.
 *             nombre:
 *               type: string
 *               description: Nombre del usuario.
 *         estudiantes:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs de los estudiantes asociados a la unidad.
 */

/**
 * @swagger
 * tags:
 *   - name: Unidades
 *     description: API para gestionar Unidades
 */

// Listar todas las unidades
/**
 * @swagger
 * /api/unidades:
 *   get:
 *     summary: Lista todas las unidades
 *     tags: [Unidades]
 *     responses:
 *       200:
 *         description: Lista de unidades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Unidad'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   - id: "63f7d2bbf1a2b4b5c3cdb800"
 *                     nombreUnidad: "Unidad de Rescate"
 *                     estadoUnidad: true
 *                     brigadaId: { _id: "63f7d2bbf1a2b4b5c3cdb801", nombre: "Comando de Emergencia" }
 *                     usuarioId: { _id: "63f7d2bbf1a2b4b5c3cdb802", nombre: "Usuario 1" }
 *                     estudiantes: [
 *                       { _id: "63f7d2bbf1a2b4b5c3cdb803", nombre: "Estudiante 1" },
 *                       { _id: "63f7d2bbf1a2b4b5c3cdb804", nombre: "Estudiante 2" }
 *                     ]
 *                   - id: "63f7d2bbf1a2b4b5c3cdb801"
 *                     nombreUnidad: "Unidad de Emergencia"
 *                     estadoUnidad: false
 *                     brigadaId: { _id: "63f7d2bbf1a2b4b5c3cdb801", nombre: "Comando de Emergencia" }
 *                     usuarioId: { _id: "63f7d2bbf1a2b4b5c3cdb804", nombre: "Usuario 2" }
 *                     estudiantes: [
 *                       { _id: "63f7d2bbf1a2b4b5c3cdb805", nombre: "Estudiante 3" }
 *                     ]
 */
router.get('/', verifyJWT, verifyRole(['Administrador', 'Root']), unidadControllers.listarUnidades);

// Obtener unidad por ID
/**
 * @swagger
 * /api/unidades/{id}:
 *   get:
 *     summary: Obtener una unidad por ID
 *     tags: [Unidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la unidad
 *     responses:
 *       200:
 *         description: Unidad encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unidad'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "63f7d2bbf1a2b4b5c3cdb800"
 *                   nombreUnidad: "Unidad de Rescate"
 *                   estadoUnidad: true
 *                   brigadaId: { _id: "63f7d2bbf1a2b4b5c3cdb801", nombre: "Comando de Emergencia" }
 *                   usuarioId: { _id: "63f7d2bbf1a2b4b5c3cdb802", nombre: "Usuario 1" }
 *                   estudiantes: ["63f7d2bbf1a2b4b5c3cdb803"]
 *       404:
 *         description: Unidad no encontrada
 */
router.get('/:id', verifyJWT, verifyRole(['Administrador', 'Root']), unidadControllers.obtenerUnidadPorId);

// Crear una unidad
/**
 * @swagger
 * /api/unidades:
 *   post:
 *     summary: Crear una nueva unidad
 *     tags: [Unidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Unidad'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 nombreUnidad: "Unidad de Emergencia"
 *                 estadoUnidad: true
 *                 brigadaId: "63f7d2bbf1a2b4b5c3cdb801"
 *                 usuarioId: "63f7d2bbf1a2b4b5c3cdb802"
 *                 estudiantes: ["63f7d2bbf1a2b4b5c3cdb803"]
 *     responses:
 *       201:
 *         description: Unidad creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unidad'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "63f7d2bbf1a2b4b5c3cdb900"
 *                   nombreUnidad: "Unidad de Emergencia"
 *                   estadoUnidad: true
 *                   brigadaId: { _id: "63f7d2bbf1a2b4b5c3cdb801", nombre: "Comando de Emergencia" }
 *                   usuarioId: { _id: "63f7d2bbf1a2b4b5c3cdb802", nombre: "Usuario 1" }
 *                   estudiantes: ["63f7d2bbf1a2b4b5c3cdb803"]
 *       400:
 *         description: Datos inválidos en la solicitud
 */
router.post('/', verifyJWT, verifyRole(['Administrador', 'Root']), unidadControllers.crearUnidad);

// Actualizar unidad
/**
 * @swagger
 * /api/unidades/{id}:
 *   put:
 *     summary: Actualizar una unidad
 *     tags: [Unidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la unidad a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Unidad'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 nombreUnidad: "Unidad de Rescate Actualizada"
 *                 estadoUnidad: false
 *                 brigadaId: "63f7d2bbf1a2b4b5c3cdb801"
 *                 usuarioId: "63f7d2bbf1a2b4b5c3cdb802"
 *                 estudiantes: ["63f7d2bbf1a2b4b5c3cdb803"]
 *     responses:
 *       200:
 *         description: Unidad actualizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unidad'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Unidad no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', verifyJWT, verifyRole(['Administrador', 'Root']), unidadControllers.actualizarUnidad);

// Desactivar unidad
/**
 * @swagger
 * /api/unidades/{id}:
 *   delete:
 *     summary: Desactivar una unidad existente
 *     tags: [Unidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la unidad a desactivar
 *     responses:
 *       200:
 *         description: Unidad desactivada exitosamente
 *       404:
 *         description: Unidad no encontrada
 */
router.delete('/:id', verifyJWT, verifyRole(['Administrador', 'Root']), unidadControllers.desactivarUnidad);

module.exports = router;
