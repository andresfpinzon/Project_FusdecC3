const express = require('express');
const cursoController = require('../controllers/curso_controllers');
const router = express.Router();
const { verifyJWT, verifyRole } = require('../config/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Curso:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado del curso
 *         nombreCurso:
 *           type: string
 *           description: Nombre del curso
 *         descripcionCurso:
 *           type: string
 *           description: Descripción del curso
 *         intensidadHorariaCurso:
 *           type: string
 *           description: Intensidad horaria del curso
 *         estadoCurso:
 *           type: boolean
 *           description: Estado del curso (activo/inactivo)
 *           default: true
 *         fundacionId:
 *           type: string
 *           description: ID de la fundación asociada
 *         ediciones:
 *           type: array
 *           items:
 *             type: string
 *             description: IDs de las ediciones del curso

 *     CursoCreate:
 *       type: object
 *       required:
 *         - nombreCurso
 *         - intensidadHorariaCurso
 *       properties:
 *         nombreCurso:
 *           type: string
 *           description: Nombre del curso
 *         descripcionCurso:
 *           type: string
 *           description: Descripción del curso
 *         intensidadHorariaCurso:
 *           type: string
 *           description: Intensidad horaria del curso
 *         estadoCurso:
 *           type: boolean
 *           description: Estado del curso (activo/inactivo)
 *           default: true
 *         fundacionId:
 *           type: string
 *           description: ID de la fundación asociada

 *     CursoUpdate:
 *       type: object
 *       properties:
 *         nombreCurso:
 *           type: string
 *           description: Nombre del curso
 *         descripcionCurso:
 *           type: string
 *           description: Descripción del curso
 *         intensidadHorariaCurso:
 *           type: string
 *           description: Intensidad horaria del curso
 *         estadoCurso:
 *           type: boolean
 *           description: Estado del curso (activo/inactivo)
 *         fundacionId:
 *           type: string
 *           description: ID de la fundación asociada
 */

/**
 * @swagger
 * tags:
 *   - name: Curso
 *     description: API para gestionar cursos
 */

/**
 * @swagger
 * /api/cursos:
 *   get:
 *     tags:
 *       - Curso
 *     summary: Obtener todos los cursos activos
 *     responses:
 *       200:
 *         description: Lista de cursos activos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Curso'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', verifyJWT, verifyRole(['Secretario', 'Root']), cursoController.listarCursosActivos);

/**
 * @swagger
 * /api/cursos:
 *   post:
 *     tags: 
 *       - Curso
 *     summary: Crear un nuevo curso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CursoCreate'
 *     responses:
 *       201:
 *         description: Curso creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', verifyJWT, verifyRole(['Secretario', 'Root']), cursoController.crearCurso);

/**
 * @swagger
 * /api/cursos/{id}:
 *   put:
 *     tags: 
 *       - Curso
 *     summary: Actualizar curso por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del curso
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CursoUpdate'
 *     responses:
 *       200:
 *         description: Curso actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       404:
 *         description: Curso no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', verifyJWT, verifyRole(['Secretario', 'Root']), cursoController.actualizarCurso);

/**
 * @swagger
 * /api/cursos/{id}:
 *   get:
 *     tags:
 *       - Curso
 *     summary: Obtener curso por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del curso a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Curso obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       404:
 *         description: Curso no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', verifyJWT, verifyRole(['Secretario', 'Root']), cursoController.obtenerCursoPorId);

/**
 * @swagger
 * /api/cursos/{id}:
 *   delete:
 *     tags: 
 *       - Curso
 *     summary: Desactivar curso por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del curso
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Curso desactivado correctamente
 *       404:
 *         description: Curso no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', verifyJWT, verifyRole(['Secretario', 'Root']), cursoController.desactivarCurso);

module.exports = router;

