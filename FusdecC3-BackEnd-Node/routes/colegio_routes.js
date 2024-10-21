const express = require("express");
const router = express.Router(); // Crear router
const colegioController = require("../controllers/colegio_controllers"); // Importar controladores
//const { verifyJWT, verifyRole } = require('../config/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Colegio:
 *       type: object
 *       required:
 *         - nombreColegio
 *         - emailColegio
 *         - estadoColegio
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado del colegio.
 *         nombreColegio:
 *           type: string
 *           description: Nombre del colegio.
 *         emailColegio:
 *           type: string
 *           description: Correo electrónico del colegio.
 *         estadoColegio:
 *           type: boolean
 *           description: Estado del colegio (activo/inactivo).
 *           default: true
 *         estudiantes:
 *           type: array
 *           items:
 *             type: string
 *             description: ID de los estudiantes asociados al colegio.
 */

/**
 * @swagger
 * tags:
 *   - name: Colegios
 *     description: API para gestionar colegios
 */

/**
 * @swagger
 * /api/colegios:
 *   get:
 *     tags:
 *       - Colegios
 *     summary: Obtener una lista de colegios
 *     responses:
 *       200:
 *         description: Una colección de colegios.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Colegio'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   - id: "61f7d2bbf1a2b4b5c3cdb71d"
 *                     nombreColegio: "Colegio Nacional"
 *                     emailColegio: "contacto@colegionacional.edu"
 *                     estadoColegio: true
 */
router.get("/", colegioController.listarColegiosActivos);

/**
 * @swagger
 * /api/colegios:
 *   post:
 *     tags:
 *       - Colegios
 *     summary: Crear un colegio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Colegio'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 nombreColegio: "Nuevo Colegio"
 *                 emailColegio: "contacto@nuevo-colegio.edu"
 *                 estadoColegio: true
 *     responses:
 *       201:
 *         description: Colegio creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Colegio'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71e"
 *                   nombreColegio: "Nuevo Colegio"
 *                   emailColegio: "contacto@nuevo-colegio.edu"
 *                   estadoColegio: true
 */
router.post("/", colegioController.crearColegio);

/**
 * @swagger
 * /api/colegios/{id}:
 *   put:
 *     tags:
 *       - Colegios
 *     summary: Actualizar un colegio mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del colegio a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Colegio'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 nombreColegio: "Colegio Modificado"
 *                 emailColegio: "contacto@colegio-modificado.edu"
 *                 estadoColegio: false
 *     responses:
 *       200:
 *         description: Colegio actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Colegio'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71e"
 *                   nombreColegio: "Colegio Modificado"
 *                   emailColegio: "contacto@colegio-modificado.edu"
 *                   estadoColegio: false
 *       404:
 *         description: Colegio no encontrado.
 */
router.put("/:id", colegioController.actualizarColegio);

/**
 * @swagger
 * /api/colegios/{id}:
 *   delete:
 *     tags:
 *       - Colegios
 *     summary: Desactivar un colegio mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del colegio a desactivar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Colegio desactivado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Colegio'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71e"
 *                   nombreColegio: "Colegio Nacional"
 *                   emailColegio: "contacto@colegionacional.edu"
 *                   estadoColegio: false
 *       404:
 *         description: Colegio no encontrado.
 */
router.delete("/:id", colegioController.desactivarColegio);

/**
 * @swagger
 * /api/colegios/{id}:
 *   get:
 *     tags:
 *       - Colegios
 *     summary: Obtener un colegio mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del colegio
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Colegio obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Colegio'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71e"
 *                   nombreColegio: "Colegio Nacional"
 *                   emailColegio: "contacto@colegionacional.edu"
 *                   estadoColegio: true
 *       404:
 *         description: Colegio no encontrado.
 */
router.get("/:id", colegioController.obtenerColegiosPorId);

module.exports = router;
