/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

const express = require('express');

const fieldsController = require('../controllers/fields.controller');
const { methodNotAllowed } = require('../controllers/errors.controller');
const imgUpload = require('../middlewares/Field-upload.middleware');

const  authenticate  = require('../middlewares/auth.middleware');
const router = express.Router();

module.exports.setup = (app) => {
  app.use('/api/v1/fields', router);

  /**
   * @openapi
   * /api/v1/fields:
   *   get:
   *     summary: get fields by type
   *     description: get fields by type
   *     parameters:
   *       - name: type_fields
   *         in: query
   *         description: Filter by field type
   *         schema:
   *           type: string
   *       - $ref: '#/components/parameters/limitParam'
   *       - $ref: '#/components/parameters/pageParam'
   *     tags:
   *       - fields
   *     responses:
   *       200:
   *         description: A list of fields
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: The response status
   *                   enum: [success]
   *                 data:
   *                   type: object
   *                   properties:
   *                     fields:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Field'
   *                     metadata:
   *                       $ref: '#/components/schemas/PaginationMetadata'
   */
  router.get('/', fieldsController.getFieldsbyType);

  /**
   * @swagger
   * /api/v1/fields:
   *   post:
   *     summary: Create a new field
   *     description: Create a field
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/Field'
   *     tags:
   *       - fields
   *     responses:
   *       '201':
   *         description: The field was created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: The response status
   *                   enum: [success]
   *                 data:
   *                   type: object
   *                   properties:
   *                     field:
   *                       $ref: '#/components/schemas/Field'
   */
  router.post('/', imgUpload, authenticate , fieldsController.createFields);

  /**
   * @swagger
   * /api/v1/fields:
   *   delete:
   *     summary: Delete all fields
   *     description: Delete all fields in the database
   *     tags:
   *       - fields
   *     responses:
   *       200:
   *         description: All fields were deleted successfully
   *         $ref: '#/components/schemas/Field'
   */
  router.delete('/', authenticate,fieldsController.deleteAllFields);

  router.all('/', methodNotAllowed);

  /**
   * @openapi
   * /api/v1/fields/{field_id}:
   *   get:
   *     summary: Get fields by ID
   *     description: Get fields by ID
   *     parameters:
   *       - $ref: '#/components/parameters/fieldsIdParam'
   *     tags:
   *       - fields
   *     responses:
   *       200:
   *         description: A field
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: The response status
   *                   enum: [success]
   *                 data:
   *                   type: object
   *                   properties:
   *                     field:
   *                       $ref: '#/components/schemas/Field'
   */
  router.get('/:field_id', fieldsController.getFields);
  /**
 * @openapi
 * /api/v1/fields/:
 *   get:
 *     summary: Get all fields
 *     description: Get all fields in the database
 *     tags:
 *       - fields
 *     responses:
 *       200:
 *         description: A list of fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The response status
 *                   enum: [success]
 *                 data:
 *                   type: object
 *                   properties:
 *                     fields:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Field'
 */
router.get('/', fieldsController.getAllFields);
  /**
   * @swagger
   * /api/v1/fields/{field_id}:
   *   put:
   *     summary: Update field by ID
   *     description: Update field information by field ID
   *     parameters:
   *       - $ref: '#/components/parameters/fieldsIdParam'
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/Field'
   *     tags:
   *       - fields
   *     responses:
   *       200:
   *         description: An updated field
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   description: The response status
   *                   enum: [success]
   *                 data:
   *                   type: object
   *                   properties:
   *                     field:
   *                       $ref: '#/components/schemas/Field'
   */
  router.put('/:field_id', authenticate,imgUpload, fieldsController.updateFields);

  /**
   * @swagger
   * /api/v1/fields/{field_id}:
   *   delete:
   *     summary: Delete a field by ID
   *     description: Delete a field by its ID from the database
   *     parameters:
   *       - $ref: '#/components/parameters/fieldsIdParam'
   *     tags:
   *       - fields
   *     responses:
   *       200:
   *         description: Field deleted successfully
   *         $ref: '#/components/responses/200NoData'
   */
  router.delete('/:field_id', authenticate,fieldsController.deleteField);

  router.all('/:field_id', methodNotAllowed);
  
};
