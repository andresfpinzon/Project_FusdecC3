const express = require('express');
const cursoControllers = require('../controllers/curso_controllers'); // Importa el controlador
const router = express.Router(); // Define el enrutador

// Listar todos los cursos activos
/**
 * @swagger
 * /api/cursos:
 *   get:
 *     summary: Lista todos los cursos activos
 *     tags:
 *       - Cursos
 *     responses:
 *       200:
 *         description: Lista de cursos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "66d05dddb025aa6e32e1654b"
 *                   titulo:
 *                     type: string
 *                     example: "Introducción a React.JS"
 *                   descripcion:
 *                     type: string
 *                     example: "Curso básico sobre React.JS"
 *                   estado:
 *                     type: boolean
 *                     example: true
 *                   imagen:
 *                     type: string
 *                     example: "https://example.com/react.png"
 *                   alumnos:
 *                     type: number
 *                     example: 20
 *                   calificacion:
 *                     type: number
 *                     example: 4.7
 */
router.get('/', cursoControllers.listarCursosActivos);


// Obtener curso por Id
/**
 * @swagger
 * /api/cursos/{id}:
 *   get:
 *     summary: Obtiene un curso por su ID
 *     tags:
 *       - Cursos
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Detalles del curso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "66d05dddb025aa6e32e1654b"
 *                 titulo:
 *                   type: string
 *                   example: "Introducción a React.JS"
 *                 descripcion:
 *                   type: string
 *                   example: "Curso básico sobre React.JS"
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 imagen:
 *                   type: string
 *                   example: "https://example.com/react.png"
 *                 alumnos:
 *                   type: number
 *                   example: 20
 *                 calificacion:
 *                   type: number
 *                   example: 4.7
 *       404:
 *         description: Curso no encontrado
 */
router.get('/:id', cursoControllers.obtenerCursoPorId);


// Crear un curso
/**
 * @swagger
 * /api/cursos:
 *   post:
 *     summary: Crea un nuevo curso
 *     tags:
 *       - Cursos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Curso de Node.js"
 *               descripcion:
 *                 type: string
 *                 example: "Aprende Node.js desde cero"
 *               estado:
 *                 type: boolean
 *                 example: true
 *               imagen:
 *                 type: string
 *                 example: "https://example.com/nodejs.png"
 *     responses:
 *       201:
 *         description: Curso creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "66d05dddb025aa6e32e1654d"
 *                 titulo:
 *                   type: string
 *                   example: "Curso de Node.js"
 *                 descripcion:
 *                   type: string
 *                   example: "Aprende Node.js desde cero"
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 imagen:
 *                   type: string
 *                   example: "https://example.com/nodejs.png"
 *       400:
 *         description: Error en la solicitud
 */
router.post('/', cursoControllers.crearCurso);

// Crear Colección de Cursos
/**
 * @swagger
 * /api/cursos/coleccion:
 *   post:
 *     summary: Crea una colección de nuevos cursos
 *     tags:
 *       - Cursos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 titulo:
 *                   type: string
 *                   example: "Curso de JavaScript"
 *                 descripcion:
 *                   type: string
 *                   example: "Aprende JavaScript desde cero"
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 imagen:
 *                   type: string
 *                   example: "https://example.com/js.png"
 *     responses:
 *       201:
 *         description: Colección de cursos creada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "66d05dddb025aa6e32e1654e"
 *                   titulo:
 *                     type: string
 *                     example: "Curso de JavaScript"
 *                   descripcion:
 *                     type: string
 *                     example: "Aprende JavaScript desde cero"
 *                   estado:
 *                     type: boolean
 *                     example: true
 *                   imagen:
 *                     type: string
 *                     example: "https://example.com/js.png"
 *       400:
 *         description: Error en la solicitud
 */
router.post('/coleccion', cursoControllers.guardarColeccionCursos);

// Actualizar curso
/**
 * @swagger
 * /api/cursos/{id}:
 *   put:
 *     summary: Actualiza un curso existente
 *     tags:
 *       - Cursos
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del curso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Curso de Node.js avanzado"
 *               descripcion:
 *                 type: string
 *                 example: "Aprende Node.js a un nivel avanzado"
 *               estado:
 *                 type: boolean
 *                 example: true
 *               imagen:
 *                 type: string
 *                 example: "https://example.com/nodejs_avanzado.png"
 *     responses:
 *       200:
 *         description: Curso actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "66d05dddb025aa6e32e1654f"
 *                 titulo:
 *                   type: string
 *                   example: "Curso de Node.js avanzado"
 *                 descripcion:
 *                   type: string
 *                   example: "Aprende Node.js a un nivel avanzado"
 *                 estado:
 *                   type: boolean
 *                   example: true
 *                 imagen:
 *                   type: string
 *                   example: "https://example.com/nodejs_avanzado.png"
 */
router.put('/:id', cursoControllers.actualizarCurso);

// Eliminar Curso
/**
 * @swagger
 * /api/cursos/{id}:
 *   delete:
 *     summary: Desactiva un curso existente
 *     tags:
 *       - Cursos
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Curso desactivado con éxito
 *       404:
 *         description: Curso no encontrado
 */
router.delete('/:id', cursoControllers.desactivarCurso);

module.exports = router;