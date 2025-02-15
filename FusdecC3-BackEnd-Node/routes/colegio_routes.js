const express = require("express");
const router = express.Router(); // Crear router
const colegioController = require("../controllers/colegio_controllers"); // Importar controladores
const { verifyJWT, verifyRole } = require('../config/authMiddleware');

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
router.get("/", verifyJWT, verifyRole(['Secretario','Instructor','Administrativo', 'Root']), colegioController.listarColegiosActivos);

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
router.post("/", verifyJWT, verifyRole(['Administrativo','Root']), colegioController.crearColegio);

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
router.put("/:id", verifyJWT, verifyRole(['Administrativo','Root']), colegioController.actualizarColegio);

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
router.delete("/:id", verifyJWT, verifyRole(['Administrativo','Root']), colegioController.desactivarColegio);

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
router.get("/:id", verifyJWT, verifyRole(['Administrativo','Root']), colegioController.obtenerColegiosPorId);

/**
 * @swagger
 * /api/colegios/{id}/estudiantes:
 *   post:
 *     tags:
 *       - Colegios
 *     summary: Agregar estudiantes a un colegio
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del colegio al que se le agregarán los estudiantes.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estudiantes:
 *                 type: array
 *                 items:
 *                   type: string
 *           examples:
 *             ejemplo1:
 *               value:
 *                 estudiantes: [
 *                   "60d21b4667d0d8992e610c81", // ID del estudiante 1
 *                   "60d21b4667d0d8992e610c82"  // ID del estudiante 2
 *                 ]
 *     responses:
 *       200:
 *         description: Estudiantes agregados correctamente al colegio.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Colegio'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   _id: "60d21b4667d0d8992e610c84"
 *                   nombreColegio: "Colegio Ejemplo"
 *                   estudiantes: [
 *                     "60d21b4667d0d8992e610c81",
 *                     "60d21b4667d0d8992e610c82"
 *                   ]
 *       400:
 *         description: Error de validación.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: 'Se requiere un array de IDs de estudiantes'
 *       404:
 *         description: Colegio no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: 'Colegio no encontrado'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: 'Error al agregar estudiantes: [detalles del error]'
 */
router.post("/:id/estudiantes",  verifyJWT, verifyRole(['Administrativo','Root']), colegioController.agregarEstudianteAColegio);

module.exports = router;
