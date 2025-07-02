/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express');

const reservationsController = require('../controllers/user_reservations.controller');

const router = express.Router();

const user_authenticate = require('../middlewares/user_auth.middleware');


// eslint-disable-next-line no-undef
module.exports.setup = (app) => {
     app.use('/api/v1/user_reservations', router);

     router.post('/', user_authenticate, reservationsController.createReservation);
     // router.delete('/:id', authenticate, reservationsController.deleteReservation);
     router.get('/:user_id', user_authenticate, reservationsController.getByuserId);
     // router.put('/:reservation_id', user_authenticate, reservationsController.updateReservation);
     
}