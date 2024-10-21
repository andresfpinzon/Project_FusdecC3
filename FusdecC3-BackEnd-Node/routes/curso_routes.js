const express = require('express');
const cursoController = require('../controllers/curso_controllers'); // Importa el controlador
const router = express.Router(); // Define el enrutador
//const { verifyJWT, verifyRole } = require('../config/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Curso:
 *       type: object
 *       required:
 *         - nombreCurso
 *         - intensidadHorariaCurso
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado del curso.
 *         nombreCurso:
 *           type: string
 *           description: Nombre del curso.
 *         descripcionCurso:
 *           type: string
 *           description: Descripción del curso.
 *         intensidadHorariaCurso:
 *           type: string
 *           description: Intensidad horaria del curso.
 *         estadoCurso:
 *           type: boolean
 *           description: Estado del curso (activo/inactivo).
 *           default: true
 *         fundacionId:
 *           type: string
 *           description: ID de la fundación asociada.
 *         ediciones:
 *           type: array
 *           items:
 *             type: string
 *             description: IDs de las ediciones del curso.
 */

/**
 * @swagger
 * tags:
 *   - name: Cursos
 *     description: API para gestionar cursos
 */

/**
 * @swagger
 * /api/cursos:
 *   get:
 *     tags:
 *       - Cursos
 *     summary: Obtener una lista de cursos activos
 *     responses:
 *       200:
 *         description: Una colección de cursos activos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Curso'
 */
router.get('/', cursoController.listarCursosActivos);

/**
 * @swagger
 * /api/cursos:
 *   post:
 *     tags:
 *       - Cursos
 *     summary: Crear un nuevo curso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 nombreCurso: "Curso de Programación"
 *                 descripcionCurso: "Curso básico de programación."
 *                 intensidadHorariaCurso: "40 horas"
 *                 estadoCurso: true
 *                 fundacionId: "605c72ef56d7b3e0e0f8b8d5"
 *                 ediciones: ["605c72ef56d7b3e0e0f8b8d6"]
 *     responses:
 *       201:
 *         description: Curso creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71d"
 *                   nombreCurso: "Curso de Programación"
 *                   descripcionCurso: "Curso básico de programación."
 *                   intensidadHorariaCurso: "40 horas"
 *                   estadoCurso: true
 *                   fundacionId: "605c72ef56d7b3e0e0f8b8d5"
 *                   ediciones: ["605c72ef56d7b3e0e0f8b8d6"]
 */
router.post('/', cursoController.crearCurso);

/**
 * @swagger
 * /api/cursos/{id}:
 *   put:
 *     tags:
 *       - Cursos
 *     summary: Actualizar un curso mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del curso a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Curso'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 nombreCurso: "Curso de Programación Avanzado"
 *                 descripcionCurso: "Curso avanzado de programación."
 *                 intensidadHorariaCurso: "60 horas"
 *                 ediciones: ["605c72ef56d7b3e0e0f8b8d6"]
 *     responses:
 *       200:
 *         description: Curso actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71d"
 *                   nombreCurso: "Curso de Programación Avanzado"
 *                   descripcionCurso: "Curso avanzado de programación."
 *                   intensidadHorariaCurso: "60 horas"
 *                   estadoCurso: true
 *                   fundacionId: "605c72ef56d7b3e0e0f8b8d5"
 *                   ediciones: ["605c72ef56d7b3e0e0f8b8d6"]
 *       404:
 *         description: Curso no encontrado.
 */
router.put('/:id', cursoController.actualizarCurso);

/**
 * @swagger
 * /api/cursos/{id}:
 *   delete:
 *     tags:
 *       - Cursos
 *     summary: Desactivar un curso mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del curso a desactivar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Curso desactivado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71d"
 *                   nombreCurso: "Curso de Programación"
 *                   descripcionCurso: "Curso básico de programación."
 *                   intensidadHorariaCurso: "40 horas"
 *                   estadoCurso: false
 *                   fundacionId: "605c72ef56d7b3e0e0f8b8d5"
 *                   ediciones: []
 *       404:
 *         description: Curso no encontrado.
 */
router.delete('/:id', cursoController.desactivarCurso);

/**
 * @swagger
 * /api/cursos/{id}:
 *   get:
 *     tags:
 *       - Cursos
 *     summary: Obtener un curso mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del curso
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Curso obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71d"
 *                   nombreCurso: "Curso de Programación"
 *                   descripcionCurso: "Curso básico de programación."
 *                   intensidadHorariaCurso: "40 horas"
 *                   estadoCurso: true
 *                   fundacionId: "605c72ef56d7b3e0e0f8b8d5"
 *                   ediciones: ["605c72ef56d7b3e0e0f8b8d6"]
 *       404:
 *         description: Curso no encontrado.
 */
router.get('/:id', cursoController.obtenerCursoPorId);

module.exports = router;
