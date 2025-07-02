/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const ApiError = require('../api-error');
const JSend = require('../jsend');
const reservationsService = require('../service/reservations.service');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });


async function createReservation(req, res, next) {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY_USER);
        const userId = decoded.user_id;
        const reservation = await reservationsService.createReservations({ ...req.body, user_id: userId });
        console.log(reservation);

        
        return res
            .status(201)
            .json(
                JSend.success({
                    reservation
                })
            );

    }catch(error){
        console.log(error);
        return next(new ApiError(500, 'An error occurred while creating the reservation'));

    }
    
}


async function getByuserId(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY_USER);
    const userId = decoded.user_id;
    const reservations = await reservationsService.getByuserId(userId);


    reservations.forEach(reservation => {
        reservation.reservation_date = new Date(reservation.reservation_date).toLocaleDateString();
        reservation.start_time = new Date(`1970-01-01T${reservation.start_time}`).toLocaleTimeString('en-US', { hour12: false });
        reservation.end_time = new Date(`1970-01-01T${reservation.end_time}`).toLocaleTimeString('en-US', { hour12: false });
    });

    console.log(reservations);
    return res.json(reservations);

  }catch (error) {
    console.log(error);
    return next(new ApiError(500, 'An error occurred while getting the reservation'));
  }
}
async function getAllReservations(req, res, next) {
  try {
    const reservations = await reservationsService.getAllReservations();
    reservations.forEach(reservation => {
        reservation.reservation_date = new Date(reservation.reservation_date).toLocaleDateString();
        reservation.start_time = new Date(`1970-01-01T${reservation.start_time}`).toLocaleTimeString('en-US', { hour12: false });
        reservation.end_time = new Date(`1970-01-01T${reservation.end_time}`).toLocaleTimeString('en-US', { hour12: false });
    });
    
    return res.json(reservations);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'An error occurred while getting the reservation'));
  }
}
async function updateReservation(req, res, next) {
    if(Object.keys(req.body).length === 0 && req.file){
            return next(new ApiError(400, 'Data updated no empty'))
        }
        const { reservation_id } = req.params;
        console.log(reservation_id);
    try {
        const updated = await reservationsService.updateReservation(reservation_id, {
            ...req.body
        });
        if(!updated){
            return next(new ApiError(404, 'reservation not found'));

        }
        return res.json(JSend.success({reservation: updated}));
        
          

     } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'An error occurred while updating the reservation'));
    }
    
}

module.exports = {
    createReservation,
    getByuserId,
    getAllReservations,
    updateReservation


}