/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

const express = require('express');

const imgUpload = require('../middlewares/Users-upload.middleware');

const usersController = require('../controllers/users.controller');

const router = express.Router();



// eslint-disable-next-line no-undef
module.exports.setup = (app) => {
    app.use('/api/v1/users', router);
    /**
     * @openapi
     * /api/v1/users/register:
     *   post:
     *     summary: Đăng ký User
     *     description: Đăng ký user mới vào hệ thống
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             $ref: '#/components/schemas/User'
     *     tags:
     *       - users
     *     responses:
     *       201:
     *         description: Đăng ký thành công
     *         content:
     *           multipart/form-data:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   description: Trạng thái phản hồi
     *                   enum: [success]
     *                 data:
     *                   type: object
     *                   properties:
     *                     users:
     *                       $ref: '#/components/schemas/User'
     */
    router.post('/register', imgUpload, usersController.registerUser);


    /**
	 * @swagger
	 * /api/v1/users/login:
	 *   post:
	 *     summary: Login
	 *     tags: [users]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - phone
	 *               - password
	 *             properties:
	 *               phone:
	 *                 type: string
	 *               password:
	 *                 type: string
	 *     responses:
	 *       200NoData:
	 *         description: logged in
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
	 *                     type: array
	 *                     items:
	 *                       $ref: '#/components/schemas/User'
	 */
router.post('/login', usersController.loginUser);


    /**
     * @openapi
     * /api/v1/users:
     *   get:
     *     summary: Lấy danh sách User
     *     description: Lấy danh sách user trong hệ thống
     *     tags:
     *       - users
     *     responses:
     *       200:
     *         description: Lấy danh sách thành công
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/User'
     */
// router.get('/', usersController.getUsers);

    /**
     * @openapi
     * /api/v1/users/{id}:
     *   get:
     *     summary: Lấy thông tin User theo ID
     *     description: Lấy thông tin user theo ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     tags:
     *       - users
     *     responses:
     *       200:
     *         description: Lấy thông tin thành công
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     */
    router.get('/:id', usersController.getUserById);

    // /**
    //  * @openapi
    //  * /api/v1/users/{id}:
    //  *   put:
    //  *     summary: Cập nhật thông tin User
    //  *     description: Cập nhật thông tin user
    //  *     parameters:
    //  *       - in: path
    //  *         name: id
    //  *         required: true
    //  *         schema:
    //  *           type: integer
    //  *     requestBody:
    //  *       required: true
    //  *       content:
    //  *         multipart/form-data:
    //  *           schema:
    //  *             $ref: '#/components/schemas/User'
    //  *     tags:
    //  *       - users
    //  *     responses:
    //  *       200:
    //  *         description: Cập nhật thành công
    //  *         content:
    //  *           application/json:
    //  *             schema:
    //  *               type: object
    //  *               properties:
    //  *                 status:
    //  *                   type: string
    //  *                   description: Trạng thái phản hồi
    //  *                   enum: [success]
    //  */
    // router.put('/:id', imgUpload, usersController.updateUser);

    // /**
    //  * @openapi
    //  * /api/v1/users/{id}:
    //  *   delete:
    //  *     summary: Xóa User
    //  *     description: Xóa user
    //  *     parameters:
    //  *       - in: path
    //  *         name: id
    //  *         required: true
    //  *         schema:
    //  *           type: integer
    //  *     tags:
    //  *       - users
    //  *     responses:
    //  *       200:
    //  *         description: Xóa thành công
    //  *         content:
    //  *           application/json:
    //  *             schema:
    //  *               type: object
    //  *               properties:
    //  *                 status:
    //  *                   type: string
    //  *                   description: Trạng thái phản hồi
    //  *                   enum: [success]
    //  */
    // router.delete('/:id', usersController.deleteUser);


}