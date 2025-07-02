/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express');

const reservationsController = require('../controllers/user_reservations.controller');

const router = express.Router();

const authenticate = require('../middlewares/auth.middleware');


// eslint-disable-next-line no-undef
module.exports.setup = (app) => {
    app.use('/api/v1/admin_reservations', router);
    router.get('/', authenticate, reservationsController.getAllReservations);
    router.put('/:reservation_id', authenticate, reservationsController.updateReservation);
    
}