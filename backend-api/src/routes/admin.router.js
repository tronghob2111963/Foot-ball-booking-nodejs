/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express');

const adminController = require('../controllers/admin.controller');
// const { methodNotAllowed } = require('../controllers/errors.controller');
const  imgUpload     = require('../middlewares/Admin-upload.middleware');
// const authenticate = require('../middlewares/auth.middleware');
const router = express.Router();


// eslint-disable-next-line no-undef
module.exports.setup = (app) => {
   app.use('/api/v1/admin', router);  
/**
 * @openapi
 * /api/v1/admin/login:
 *   post:
 *     summary: Đăng nhập admin
 *     description: Đăng nhập admin vào hệ thống
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the admin
 *               password:
 *                 type: string
 *                 description: Password of the admin
 *     tags:
 *       - admin
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
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
 *                     token:
 *                       type: string
 *                       description: Token đăng nhập
 */
router.post('/login', adminController.login);


/**
 * @openapi
 * /api/v1/admin/register:
 *   post:
 *     summary: Đăng ký admin
 *     description: Đăng ký admin mới vào hệ thống
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     tags:
 *       - admin
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
 *                     admin:
 *                       $ref: '#/components/schemas/Admin'
 */
router.post('/register', imgUpload , adminController.register);


/**
 * @openapi
 * /api/v1/admin/{admin_Id}:
 *   get:
 *     summary: Lấy thông tin admin
 *     description: Lấy thông tin admin theo ID
 *     parameters:
 *       - name: admin_Id
 *         in: path
 *         required: true
 *         description: ID admin
 *     tags:
 *       - admin
 *     responses:
 *       200:
 *         description: Thông tin admin
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
 *                     admin:
 *                       $ref: '#/components/schemas/Admin'
 */

router.get('/:admin_Id', adminController.getAdmin);

/**
 * @openapi
 * /api/v1/admin/{admin_Id}:
 *   put:
 *     summary: Cập nhật thông tin admin
 *     description: Cập nhật thông tin admin theo ID
 *     parameters:
 *       - name: admin_Id
 *         in: path
 *         required: true
 *         description: ID admin
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Tên đăng nhập
 *               password:
 *                 type: string
 *                 description: Mật khẩu
 *     tags:
 *       - admin
 *     responses:
 *       200:
 *         description: Thông tin admin đã được cập nhật
 *         content:
 *           application/json:
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
 *                     admin:
 *                       $ref: '#/components/schemas/Admin'
 */
router.put('/:admin_Id', adminController.updateAdmin);

}







