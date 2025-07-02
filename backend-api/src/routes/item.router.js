/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
// eslint-disable-next-line no-undef
const express = require('express');

const itemController = require('../controllers/item.controller');

const router = express.Router();

const imgUpload = require('../middlewares/Item-upload.middleware');

const authenticate = require('../middlewares/auth.middleware');
// eslint-disable-next-line no-undef
module.exports.setup = (app) => {
    app.use('/api/v1/items', router);

/**
 * @openapi
 * /api/v1/items:
 *   get:
 *     summary: Get all items
 *     description: Get all items
 *     tags:
 *       - Item
 *     responses:
 *       200:
 *         description: OK
 */
 router.get('/', itemController.getAllItems);

   /**
   * @openapi
   * /api/v1/items:
   *   get:
   *     summary: get item by name
   *     description: get item by name
   *     parameters:
   *       - name: item_name
   *         in: query
   *         description: Filter by item name
   *         schema:
   *           type: string
   *       - $ref: '#/components/parameters/limitParam'
   *       - $ref: '#/components/parameters/pageParam'
   *     tags:
   *       - Item
   *     responses:
   *       200:
   *         description: A list of item
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
   *                     item:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Item'
   *                     metadata:
   *                       $ref: '#/components/schemas/PaginationMetadata'
   */  
    router.get('/', itemController.getItemByName);

      /**
   * @openapi
   * /api/v1/items:
   *   post:
   *     summary: Create a new Item
   *     description: Create a Item
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/Item'
   *     tags:
   *       - Item
   *     responses:
   *       '201':
   *         description: The item was created successfully
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
   *                     item:
   *                       $ref: '#/components/schemas/Item'
   */
    router.post('/',authenticate,imgUpload, itemController.createItem);

    /**
   * @swagger
   * /api/v1/items/{items_id}:
   *   put:
   *     summary: update a item by ID
   *     description: update a field by its ID from the database
   *     parameters:
   *       - $ref: '#/components/parameters/itemIdParam'
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/Item'
   *     tags:
   *       - Item
   *     responses:
   *       200:
   *         description: An updated item
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
   *                     item:
   *                       $ref: '#/components/schemas/Item'
   */
    router.put('/:items_id', authenticate,imgUpload, itemController.updateItem);

      /**
   * @openapi
   * /api/v1/items/{items_id}:
   *   delete:
   *     summary: Delete a item by ID
   *     description: Delete a field by its ID from the database
   *     parameters:
   *       - $ref: '#/components/parameters/itemIdParam'
   *     tags:
   *       - Item
   *     responses:
   *       200:
   *         description: Item deleted successfully
   *         $ref: '#/components/responses/200NoData'
   */
    router.delete('/:items_id', authenticate,itemController.deleteItem);

}