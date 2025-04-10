const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rol_controllers');
const { verifyJWT, verifyRole } = require('../config/authMiddleware');

/**
 * @swagger
 * /api/roles/enum:
 *   get:
 *     tags: 
 *       - Roles
 *     summary: Obtener una lista de roles desde el enum
 *     description: Retorna un arreglo de roles definidos en el enum del backend. Solo accesible para usuarios con roles "Root" o "Administrador".
 *     responses:
 *       200:
 *         description: Lista de roles obtenidos desde el enum.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   - "Administrativo"
 *                   - "Instructor"
 *                   - "Secretario"
 *                   - "Root"
 *       401:
 *         description: No autorizado. Token no válido o no proporcionado.
 *       403:
 *         description: Prohibido. El usuario no tiene permiso para acceder a este recurso.
 *       500:
 *         description: Error interno del servidor.
 */

// Ruta para obtener roles del enum
router.get('/enum', verifyJWT, verifyRole(['Root', 'Administrador']), rolController.obtenerRolesEnum);

// Ruta para listar roles
router.get('/', verifyJWT, verifyRole(['Root', 'Administrador']), rolController.listarRoles);

// Ruta para crear un rol
router.post('/', verifyJWT, verifyRole(['Root', 'Administrador']), rolController.crearRol);

// Ruta para actualizar un rol
router.put('/:id', verifyJWT, verifyRole(['Root', 'Administrador']), rolController.actualizarRol);

// Ruta para eliminar (desactivar) un rol
router.delete('/:id', verifyJWT, verifyRole(['Root', 'Administrador']), rolController.eliminarRol);

module.exports = router;
