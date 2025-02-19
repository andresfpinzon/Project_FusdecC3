const express = require('express');
const objetivoController = require('../controllers/objetivo_controllers');
const router = express.Router();
const { verifyJWT, verifyRole } = require('../config/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Objetivo:
 *       type: object
 *       required:
 *         - tituloObjetivo
 *         - descripcionObjetivo
 *         - estadoObjetivo
 *         - cursoId
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado del objetivo.
 *         tituloObjetivo:
 *           type: string
 *           description: Título del objetivo.
 *         descripcionObjetivo:
 *           type: string
 *           description: Descripción detallada del objetivo.
 *         estadoObjetivo:
 *           type: boolean
 *           description: Estado del objetivo (activo/inactivo).
 *           default: true
 *         cursoId:
 *           type: string
 *           description: ID del curso asociado al objetivo.
 *       example:
 *         id: "63f1b7f89f1b2c001234abcd"
 *         tituloObjetivo: "Completar el módulo introductorio"
 *         descripcionObjetivo: "El estudiante debe finalizar el módulo 1 antes de la fecha límite."
 *         estadoObjetivo: true
 *         cursoId: "63f1b6d09f1b2c0012341234"
 */

/**
 * @swagger
 * tags:
 *   - name: Objetivos
 *     description: API para gestionar objetivos del sistema.
 */

/**
 * @swagger
 * /api/objetivos:
 *   get:
 *     summary: Obtener una lista de objetivos activos.
 *     tags: [Objetivos]
 *     responses:
 *       200:
 *         description: Lista de objetivos activos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Objetivo'
 *       401:
 *         description: Acceso no autorizado.
 */
router.get('/', verifyJWT, verifyRole(['Secretario', 'Root']), objetivoController.listarObjetivosActivos);

/**
 * @swagger
 * /api/objetivos:
 *   post:
 *     summary: Crear un nuevo objetivo.
 *     tags: [Objetivos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Objetivo'
 *           example:
 *             tituloObjetivo: "Completar proyecto final"
 *             descripcionObjetivo: "Los estudiantes deben entregar el proyecto final antes del 15 de diciembre."
 *             estadoObjetivo: true
 *             cursoId: "63f1b6d09f1b2c0012341234"
 *     responses:
 *       201:
 *         description: Objetivo creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Objetivo'
 *       400:
 *         description: Error en la validación de los datos enviados.
 *       409:
 *         description: El título del objetivo ya está en uso.
 */
router.post('/', verifyJWT, verifyRole(['Secretario', 'Root']), objetivoController.crearObjetivo);

/**
 * @swagger
 * /api/objetivos/{id}:
 *   put:
 *     summary: Actualizar un objetivo existente.
 *     tags: [Objetivos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del objetivo a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Objetivo'
 *           example:
 *             tituloObjetivo: "objetivo 1"
 *               descripcionObjetivo: "el estudiante puede prevenir una cituacion de riesgo."
 *               estadoObjetivo: true
 *               cursoId: "63f1b6d09f1b2c0012341234"
 *     responses:
 *       200:
 *         description: Objetivo actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Objetivo'
 *       404:
 *         description: Objetivo no encontrado.
 *       400:
 *         description: Error en los datos enviados.
 */
router.put('/:id', verifyJWT, verifyRole(['Secretario', 'Root']), objetivoController.actualizarObjetivo);

/**
 * @swagger
 * /api/objetivos/{id}:
 *   delete:
 *     summary: Desactivar un objetivo.
 *     tags: [Objetivos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del objetivo a desactivar.
 *     responses:
 *       200:
 *         description: Objetivo desactivado correctamente.
 *       404:
 *         description: Objetivo no encontrado.
 */
router.delete('/:id', verifyJWT, verifyRole(['Secretario', 'Root']), objetivoController.desactivarObjetivo);

/**
 * @swagger
 * /api/objetivos/coleccion:
 *   post:
 *     summary: Crear una colección de objetivos.
 *     tags: [Objetivos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Objetivo'
 *           example:
 *             - tituloObjetivo: "Primera evaluación"
 *               descripcionObjetivo: "Realizar la primera evaluación del curso."
 *               estadoObjetivo: true
 *               cursoId: "63f1b6d09f1b2c0012341234"
 *             - tituloObjetivo: "objetivo 1"
 *               descripcionObjetivo: "el estudiante puede prevenir una cituacion de riesgo."
 *               estadoObjetivo: true
 *               cursoId: "63f1b6d09f1b2c0012341234"
 *     responses:
 *       201:
 *         description: Colección de objetivos creada exitosamente.
 *       400:
 *         description: Error en la validación de uno o más objetivos.
 */
router.post('/coleccion', verifyJWT, verifyRole(['Secretario', 'Root']), objetivoController.guardarColeccionObjetivos);

/**
 * @swagger
 * /api/objetivos/{id}:
 *   get:
 *     summary: Obtener un objetivo por su ID.
 *     tags: [Objetivos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del objetivo a buscar.
 *     responses:
 *       200:
 *         description: Objetivo encontrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Objetivo'
 *             example:
 *               id: "63f1b7f89f1b2c001234abcd"
 *               tituloObjetivo: "Completar el módulo introductorio"
 *               descripcionObjetivo: "El estudiante debe finalizar el módulo 1 antes de la fecha límite."
 *               estadoObjetivo: true
 *               cursoId: "63f1b6d09f1b2c0012341234"
 *       404:
 *         description: Objetivo no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               message: "Objetivo no encontrado."
 *       400:
 *         description: Solicitud mal formada.
 *         content:
 *           application/json:
 *             example:
 *               message: "ID no válido o faltante."
 */
router.get('/:id', verifyJWT, verifyRole(['Secretario', 'Root']), objetivoController.obtenerObjetivoPorId);

module.exports = router;