const express = require('express');
const colegioControllers = require('../controllers/colegio_controllers'); // Importar controladores
const router = express.Router(); // Crear router

// Listar colegios activos
/**
 * @swagger
 * /api/colegios:
 *   get:
 *     summary: Lista todos los colegios activos
 *     tags: [Colegios]
 *     responses:
 *       200:
 *         description: Lista de colegios activos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Colegio'
 *       204:
 *         description: No se encontraron colegios activos
 */
router.get('/', colegioControllers.listarColegiosActivos);

// Obtener un colegio por ID
/**
 * @swagger
 * /api/colegios/{id}:
 *   get:
 *     summary: Obtener un colegio por ID
 *     tags: [Colegios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del colegio
 *     responses:
 *       200:
 *         description: Colegio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Colegio'
 *       404:
 *         description: Colegio no encontrado
 */
router.get('/:id', colegioControllers.obtenerColegiosPorId);

// Crear un nuevo colegio
/**
 * @swagger
 * /api/colegios:
 *   post:
 *     summary: Crear un nuevo colegio
 *     tags: [Colegios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Colegio'
 *     responses:
 *       201:
 *         description: Colegio creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El colegio ya existe
 */
router.post('/', colegioControllers.crearColegio);

// Actualizar un colegio por ID
/**
 * @swagger
 * /api/colegios/{id}:
 *   put:
 *     summary: Actualizar un colegio
 *     tags: [Colegios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del colegio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Colegio'
 *     responses:
 *       200:
 *         description: Colegio actualizado con éxito
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Colegio no encontrado
 */
router.put('/:id', colegioControllers.actualizarColegio);

// Desactivar un colegio por ID
/**
 * @swagger
 * /api/colegios/{id}:
 *   delete:
 *     summary: Desactivar un colegio
 *     tags: [Colegios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del colegio a desactivar
 *     responses:
 *       200:
 *         description: Colegio desactivado con éxito
 *       404:
 *         description: Colegio no encontrado
 */
router.delete('/:id', colegioControllers.desactivarColegio);

module.exports = router;
