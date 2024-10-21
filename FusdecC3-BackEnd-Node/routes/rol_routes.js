const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rol_controllers');

/**
 * @swagger
 * components:
 *   schemas:
 *     Rol:
 *       type: object
 *       required:
 *         - nombreRol
 *         - estadoRol
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado del rol.
 *         nombreRol:
 *           type: string
 *           description: Nombre del rol.
 *         estadoRol:
 *           type: boolean
 *           description: Estado del rol (activo/inactivo).
 *           default: true
 */

/**
 * @swagger
 * tags:
 *   - name: Roles
 *     description: API para gestionar roles
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     tags: 
 *       - Roles
 *     summary: Obtener una lista de roles activos
 *     responses:
 *       200:
 *         description: Una colección de roles activos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rol'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   - id: "617f2bbf1a2b4b5c3cdb71d"
 *                     nombreRol: "Admin"
 *                     estadoRol: true
 */
router.get('/', rolController.listarRoles);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     tags: 
 *       - Roles
 *     summary: Crear un nuevo rol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rol'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 nombreRol: "Editor"
 *                 estadoRol: true
 *     responses:
 *       201:
 *         description: Rol creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rol'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "618f2bbf1a2b4b5c3cdb71e"
 *                   nombreRol: "Editor"
 *                   estadoRol: true
 *       409:
 *         description: El nombre del rol ya existe.
 */
router.post('/', rolController.crearRol);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     tags: 
 *       - Roles
 *     summary: Actualizar un rol mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del rol a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rol'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 nombreRol: "Editor Actualizado"
 *                 estadoRol: true
 *     responses:
 *       200:
 *         description: Rol actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rol'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "618f2bbf1a2b4b5c3cdb71e"
 *                   nombreRol: "Editor Actualizado"
 *                   estadoRol: true
 *       404:
 *         description: Rol no encontrado.
 */
router.put('/:id', rolController.actualizarRol);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     tags: 
 *       - Roles
 *     summary: Desactivar un rol mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del rol a desactivar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rol desactivado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rol'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "618f2bbf1a2b4b5c3cdb71e"
 *                   nombreRol: "Editor"
 *                   estadoRol: false
 *       404:
 *         description: Rol no encontrado.
 */
router.delete('/:id', rolController.desactivarRol);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     tags: 
 *       - Roles
 *     summary: Obtener un rol mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del rol
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rol obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rol'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "618f2bbf1a2b4b5c3cdb71e"
 *                   nombreRol: "Editor"
 *                   estadoRol: true
 *       404:
 *         description: Rol no encontrado.
 */
router.get('/:id', rolController.obtenerRolPorId);

module.exports = router;
