const express = require('express');
const router = express.Router();
const colegioController = require('../controllers/colegio_controllers');
const { verifyJWT, verifyRole } = require('../config/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Colegio:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado del colegio
 *         nombreColegio:
 *           type: string
 *           description: Nombre del colegio
 *         emailColegio:
 *           type: string
 *           description: Correo electrónico del colegio
 *         estadoColegio:
 *           type: boolean
 *           description: Estado del colegio (activo/inactivo)
 *         estudiantes:
 *           type: array
 *           items:
 *             type: string
 *             description: ID de estudiante asociado

 *     ColegioCreate:
 *       type: object
 *       required:
 *         - nombreColegio
 *         - emailColegio
 *         - estadoColegio
 *       properties:
 *         nombreColegio:
 *           type: string
 *           description: Nombre del colegio
 *         emailColegio:
 *           type: string
 *           description: Correo electrónico del colegio
 *         estadoColegio:
 *           type: boolean
 *           description: Estado del colegio (activo/inactivo)
 *           default: true

 *     ColegioUpdate:
 *       type: object
 *       properties:
 *         nombreColegio:
 *           type: string
 *           description: Nombre del colegio
 *         emailColegio:
 *           type: string
 *           description: Correo electrónico del colegio
 *         estadoColegio:
 *           type: boolean
 *           description: Estado del colegio (activo/inactivo)
 */

/**
 * @swagger
 * tags:
 *   - name: Colegio
 *     description: API para gestionar colegios
 */

/**
 * @swagger
 * /api/colegios:
 *   get:
 *     tags:
 *       - Colegio
 *     summary: Obtener todos los colegios activos
 *     responses:
 *       200:
 *         description: Lista de colegios activos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Colegio'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', verifyJWT, verifyRole(['Secretario', 'Instructor', 'Administrativo', 'Root']), colegioController.listarColegiosActivos);

/**
 * @swagger
 * /api/colegios:
 *   post:
 *     tags: 
 *       - Colegio
 *     summary: Crear un nuevo colegio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ColegioCreate'
 *     responses:
 *       201:
 *         description: Colegio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Colegio'
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Conflicto, colegio ya existe
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', verifyJWT, verifyRole(['Administrativo', 'Root']), colegioController.crearColegio);

/**
 * @swagger
 * /api/colegios/{id}:
 *   put:
 *     tags: 
 *       - Colegio
 *     summary: Actualizar colegio por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del colegio
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ColegioUpdate'
 *     responses:
 *       200:
 *         description: Colegio actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Colegio'
 *       404:
 *         description: Colegio no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', verifyJWT, verifyRole(['Administrativo', 'Root']), colegioController.actualizarColegio);

/**
 * @swagger
 * /api/colegios/{id}:
 *   get:
 *     tags:
 *       - Colegio
 *     summary: Obtener colegio por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del colegio a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Colegio obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Colegio'
 *       404:
 *         description: Colegio no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', verifyJWT, verifyRole(['Administrativo', 'Root']), colegioController.obtenerColegiosPorId);

/**
 * @swagger
 * /api/colegios/{id}:
 *   delete:
 *     tags: 
 *       - Colegio
 *     summary: Desactivar colegio por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del colegio
 *         schema:
 *           type: string
 *           example: string
 *     responses:
 *       200:
 *         description: Colegio desactivado correctamente
 *       404:
 *         description: Colegio no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', verifyJWT, verifyRole(['Administrativo', 'Root']), colegioController.desactivarColegio);


module.exports = router;