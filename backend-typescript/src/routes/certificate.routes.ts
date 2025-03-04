import { createCertificateController, deleteCertificateController, getAllCertificatesController, getCertificateByIdController, toggleStateCertificateController, updateCertificateController } from "@controllers/certificate.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import { Router } from "express";

const certificateRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Certificate:
 *       type: object
 *       properties:
 *         nameEmisor:
 *           type: string
 *           description: Name of the certificate issuer
 *         fechaEmision:
 *           type: string
 *           format: date
 *           description: Date when the certificate was issued
 *         codigoVerify:
 *           type: string
 *           description: Unique verification code
 *         isActive:
 *           type: boolean
 *           description: Certificate status
 *         usuario:
 *           type: string
 *           description: User ID who issued the certificate
 *         curso:
 *           type: string
 *           description: Course ID associated with the certificate
 *         estudiante:
 *           type: string
 *           description: Student ID who received the certificate
 */

/**
 * @swagger
 * /api/certificates:
 *   post:
 *     summary: Create a new certificate
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Certificate'
 *     responses:
 *       201:
 *         description: Certificate created successfully
 */
certificateRouter.post('/', authMiddleware, createCertificateController);

/**
 * @swagger
 * /api/certificates:
 *   get:
 *     summary: Get all certificates
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all certificates
 */
certificateRouter.get('/', authMiddleware, getAllCertificatesController);

/**
 * @swagger
 * /api/certificates/{id}:
 *   get:
 *     summary: Get certificate by ID
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Certificate found
 */
certificateRouter.get('/:id', authMiddleware, getCertificateByIdController);

/**
 * @swagger
 * /api/certificates/{id}:
 *   put:
 *     summary: Update a certificate
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Certificate'
 *     responses:
 *       200:
 *         description: Certificate updated successfully
 */
certificateRouter.put('/:id', authMiddleware, updateCertificateController);

/**
 * @swagger
 * /api/certificates/state/{id}:
 *   patch:
 *     summary: Toggle certificate state
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Certificate state updated successfully
 */
certificateRouter.patch('/state/:id', authMiddleware, toggleStateCertificateController);

/**
 * @swagger
 * /api/certificates/{id}:
 *   delete:
 *     summary: Delete a certificate
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Certificate deleted successfully
 */
certificateRouter.delete('/:id', authMiddleware, deleteCertificateController);

export default certificateRouter;



