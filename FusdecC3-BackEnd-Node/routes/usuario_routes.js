const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario_controllers'); 
const { verifyJWT, verifyRole } = require('../config/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nombreUsuario
 *         - apellidoUsuario
 *         - numeroDocumento
 *         - correo
 *         - contraseñaHash
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado del usuario.
 *         nombreUsuario:
 *           type: string
 *           description: Nombre del usuario.
 *         apellidoUsuario:
 *           type: string
 *           description: Apellido del usuario.
 *         numeroDocumento:
 *           type: string
 *           description: Número de documento único del usuario.
 *         correo:
 *           type: string
 *           description: Correo electrónico único del usuario.
 *         contraseñaHash:
 *           type: string
 *           description: Hash de la contraseña del usuario.
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *             description: IDs de los roles asignados al usuario.
 *         estadoUsuario:
 *           type: boolean
 *           description: Estado del usuario (activo/inactivo).
 *           default: true
 *         creadoEn:
 *           type: string
 *           format: date
 *           description: Fecha de creación del usuario.
 */

/**
 * @swagger
 * tags:
 *   - name: Usuarios
 *     description: API para gestionar usuarios
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     tags: 
 *       - Usuarios
 *     summary: Obtener una lista de usuarios
 *     responses:
 *       200:
 *         description: Una colección de usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   - id: "61f7d2bbf1a2b4b5c3cdb71d"
 *                     nombreUsuario: "Juan"
 *                     apellidoUsuario: "Pérez"
 *                     numeroDocumento: "12345678"
 *                     correo: "juan.perez@mail.com"
 *                     estadoUsuario: true
 */
router.get('/', verifyJWT, verifyRole(['Administrativo','Root']), usuarioController.listarUsuarios);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     tags: 
 *       - Usuarios
 *     summary: Crear un usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 nombreUsuario: "María"
 *                 apellidoUsuario: "González"
 *                 numeroDocumento: "87654321"
 *                 correo: "maria.gonzalez@mail.com"
 *                 password: "password123"
 *     responses:
 *       201:
 *         description: Usuario creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71e"
 *                   nombreUsuario: "María"
 *                   apellidoUsuario: "González"
 *                   numeroDocumento: "87654321"
 *                   correo: "maria.gonzalez@mail.com"
 *                   password: "password123"
 *                   roles: []
 *                   estadoUsuario: true
 */
router.post('/',verifyJWT, verifyRole(['Administrativo','Root']), usuarioController.crearUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     tags: 
 *       - Usuarios
 *     summary: Actualizar un usuario mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 nombreUsuario: "María"
 *                 apellidoUsuario: "González"
 *                 numeroDocumento: "87654321"
 *                 correo: "maria.gonzalez@mail.com"
 *                 contraseñaHash: "hashed_password"
 *                 estadoUsuario: true
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71f"
 *                   nombreUsuario: "María"
 *                   apellidoUsuario: "González"
 *                   numeroDocumento: "87654321"
 *                   correo: "maria.gonzalez@mail.com"
 *                   estadoUsuario: true
 *       404:
 *         description: Usuario no encontrado.
 */
router.put('/:id', verifyJWT, verifyRole(['Administrativo','Root']), usuarioController.actualizarUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     tags: 
 *       - Usuarios
 *     summary: Desactivar un usuario mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a desactivar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario desactivado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71f"
 *                   nombreUsuario: "María"
 *                   apellidoUsuario: "González"
 *                   numeroDocumento: "87654321"
 *                   correo: "maria.gonzalez@mail.com"
 *                   estadoUsuario: false
 *       404:
 *         description: Usuario no encontrado.
 */
router.delete('/:id', verifyJWT, verifyRole(['Administrativo','Root']), usuarioController.desactivarUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     tags: 
 *       - Usuarios
 *     summary: Obtener un usuario mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71f"
 *                   nombreUsuario: "María"
 *                   apellidoUsuario: "González"
 *                   numeroDocumento: "87654321"
 *                   correo: "maria.gonzalez@mail.com"
 *                   estadoUsuario: true
 *       404:
 *         description: Usuario no encontrado.
 */
router.get('/:id', verifyJWT, verifyRole(['Administrativo','Root']), usuarioController.obtenerUsuarioPorId);

module.exports = router;
