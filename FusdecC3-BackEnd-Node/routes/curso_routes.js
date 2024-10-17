const express = require('express');
const cursoControllers = require('../controllers/curso_controllers'); // Importa el controlador
const router = express.Router(); // Define el enrutador

// Listar todos los cursos activos
/**
 * @swagger
 * /api/cursos:
 *   get:
 *     summary: Lista todos los cursos activos
 *     tags: [Cursos]
 *     responses:
 *       200:
 *         description: Lista de cursos activos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Curso'
 */
router.get('/', cursoControllers.listarCursosActivos);



// Obtener curso por Id
/**
 * @swagger
 * /api/cursos/{id}:
 *   get:
 *     summary: Obtener un curso por ID
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Curso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       404:
 *         description: Curso no encontrado
 */
router.get('/:id', cursoControllers.obtenerCursoPorId);



// Crear un curso
/**
 * @swagger
 * /api/cursos:
 *   post:
 *     summary: Crear un nuevo curso
 *     tags: [Cursos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *     responses:
 *       201:
 *         description: Curso creado exitosamente
 *       400:
 *         description: Datos inválidos en la solicitud
 */
router.post('/', cursoControllers.crearCurso);


// Crear Colección de Cursos
/**
 * @swagger
 * /api/cursos/coleccion:
 *   post:
 *     summary: Crear una colección de cursos
 *     tags: [Cursos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Curso'
 *     responses:
 *       201:
 *         description: Colección creada exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 */
router.post('/coleccion', cursoControllers.guardarColeccionCursos);


// Actualizar curso
/**
 * @swagger
 * /api/cursos/{id}:
 *   put:
 *     summary: Actualizar un curso
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del curso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *     responses:
 *       200:
 *         description: Curso actualizado con éxito
 *       404:
 *         description: Curso no encontrado
 */
router.put('/:id', cursoControllers.actualizarCurso);


// Eliminar-Dasactivar curso Curso
/**
 * @swagger
 * /api/cursos/{id}:
 *   delete:
 *     summary: Desactivar un curso existente
 *     tags: [Cursos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del curso a desactivar
 *     responses:
 *       200:
 *         description: Curso desactivado exitosamente
 *       404:
 *         description: Curso no encontrado
 */
router.delete('/:id', cursoControllers.desactivarCurso);


module.exports = router;