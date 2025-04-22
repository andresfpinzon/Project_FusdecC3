const express = require("express");
const router = express.Router();
const edicionController = require("../controllers/edicion_controllers");
const { verifyJWT, verifyRole } = require('../config/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Edicion:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado de la edición
 *         tituloEdicion:
 *           type: string
 *           description: Título de la edición
 *         fechaInicioEdicion:
 *           type: string
 *           format: date
 *           description: Fecha de inicio de la edición (YYYY-MM-DD)
 *         fechaFinEdicion:
 *           type: string
 *           format: date
 *           description: Fecha de fin de la edición (YYYY-MM-DD)
 *         estadoEdicion:
 *           type: boolean
 *           description: Estado de la edición (activa/inactiva)
 *           default: true
 *         cursoId:
 *           type: string
 *           description: ID del curso asociado

 *     EdicionCreate:
 *       type: object
 *       required:
 *         - tituloEdicion
 *         - fechaInicioEdicion
 *         - fechaFinEdicion
 *         - cursoId
 *       properties:
 *         tituloEdicion:
 *           type: string
 *           description: Título de la edición
 *         fechaInicioEdicion:
 *           type: string
 *           format: date
 *           description: Fecha de inicio de la edición (YYYY-MM-DD)
 *         fechaFinEdicion:
 *           type: string
 *           format: date
 *           description: Fecha de fin de la edición (YYYY-MM-DD)
 *         estadoEdicion:
 *           type: boolean
 *           description: Estado de la edición (activa/inactiva)
 *           default: true
 *         cursoId:
 *           type: string
 *           description: ID del curso asociado

 *     EdicionUpdate:
 *       type: object
 *       properties:
 *         tituloEdicion:
 *           type: string
 *           description: Título de la edición
 *         fechaInicioEdicion:
 *           type: string
 *           format: date
 *           description: Fecha de inicio de la edición (YYYY-MM-DD)
 *         fechaFinEdicion:
 *           type: string
 *           format: date
 *           description: Fecha de fin de la edición (YYYY-MM-DD)
 *         estadoEdicion:
 *           type: boolean
 *           description: Estado de la edición (activa/inactiva)
 *         cursoId:
 *           type: string
 *           description: ID del curso asociado
 */

/**
 * @swagger
 * tags:
 *   - name: Edicion
 *     description: API para gestionar ediciones de cursos
 */

/**
 * @swagger
 * /api/ediciones:
 *   get:
 *     tags:
 *       - Edicion
 *     summary: Obtener todas las ediciones activas
 *     responses:
 *       200:
 *         description: Lista de ediciones activas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Edicion'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", verifyJWT, verifyRole(['Secretario', 'Root', 'Instructor']), edicionController.listarEdicionesActivas);

/**
 * @swagger
 * /api/ediciones:
 *   post:
 *     tags: 
 *       - Edicion
 *     summary: Crear una nueva edición
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EdicionCreate'
 *     responses:
 *       201:
 *         description: Edición creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Edicion'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post("/", verifyJWT, verifyRole(['Secretario', 'Root']), edicionController.crearEdicion);

/**
 * @swagger
 * /api/ediciones/{id}:
 *   put:
 *     tags: 
 *       - Edicion
 *     summary: Actualizar edición por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la edición
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EdicionUpdate'
 *     responses:
 *       200:
 *         description: Edición actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Edicion'
 *       404:
 *         description: Edición no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put("/:id", verifyJWT, verifyRole(['Secretario', 'Root']), edicionController.actualizarEdicion);

/**
 * @swagger
 * /api/ediciones/{id}:
 *   get:
 *     tags:
 *       - Edicion
 *     summary: Obtener edición por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la edición a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Edición obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Edicion'
 *       404:
 *         description: Edición no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:id", verifyJWT, verifyRole(['Secretario', 'Root']), edicionController.obtenerEdicionPorId);

/**
 * @swagger
 * /api/ediciones/{id}:
 *   delete:
 *     tags: 
 *       - Edicion
 *     summary: Desactivar edición por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la edición
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Edición desactivada correctamente
 *       404:
 *         description: Edición no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/:id", verifyJWT, verifyRole(['Secretario', 'Root']), edicionController.desactivarEdicion);

module.exports = router;
