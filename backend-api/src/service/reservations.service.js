/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const knex = require('../database/knex');




const JSend = require('../jsend');

const ApiError = require('../api-error');

function reservationRepository() {
    
    return knex('reservations');
} 
function fieldRepository() {
    
    return knex('fields');
}
function readReservations(payload){
    return{
        reservation_id: payload.reservation_id,
        user_id: payload.user_id,
        field_id: payload.field_id,
        start_time: payload.start_time,
        end_time: payload.end_time,
        status: payload.status

    }

}
async function createReservations(params) {
   try {
      const { user_id, field_id, ...reservationData } = params;
      const user_phone = reservationData.user_phone;
      const field = await fieldRepository().where({ field_id }).first();

      if(!field) {
        throw new ApiError(404, 'Field not found');
      }

      // Kiểm tra xem sân đã được đặt trong khoảng thời gian đó
      const existingReservations = await reservationRepository()
        .where('field_id', field_id)
        .where('reservation_date', '=', reservationData.reservation_date)
        .where(function() {
          this.where('start_time', '<=', reservationData.start_time)
            .where('end_time', '>=', reservationData.start_time)
            .orWhere('start_time', '<=', reservationData.end_time)
            .where('end_time', '>=', reservationData.end_time);
        });

      if (existingReservations.length > 0) {
        return new ApiError(400, 'Sân đã được đặt trong khoảng thời gian này');
      }
      const price = field.price_per_hour;
      console.log(price);

      const startDate = new Date(`${reservationData.reservation_date}T${reservationData.start_time}`);
      const endDate = new Date(`${reservationData.reservation_date}T${reservationData.end_time}`);
      const duration = (endDate.getTime() - startDate.getTime()) / 3600000;
     
      console.log(duration);
      const totalPrice = price * duration;
      console.log(totalPrice);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const reservation = await reservationRepository().insert({
         ...reservationData, 
         user_id,
         field_id,
         total_price: totalPrice,
        });

      return {
        user_id,
        field_id,
        user_phone,
        start_time: reservationData.start_time,
        end_time: reservationData.end_time,
        total_price: totalPrice,
      };
  } catch (error) {
      console.log(error);
      throw new ApiError(500, 'An error occurred while creating the reservation');
  }
}

async function getByuserId(user_id) {
    return reservationRepository().where({ user_id });
}
async function getAllReservations() {
    return reservationRepository().select('*');
}

async function updateReservation(reservation_id, payload) {
    try {
      const updatedReservation = await reservationRepository()
        .where('reservation_id', reservation_id)
        .select('*')
        .first();
      const field_id = field_id;
      const { ...reservationData } = updatedReservation;
      if (!updatedReservation) {
        throw new ApiError(404, 'Reservation not found');
      }
      const existingReservations = await reservationRepository()
        .where('field_id', field_id)
        .where('reservation_date', '=', reservationData.reservation_date)
        .where(function() {
          this.where('start_time', '<=', reservationData.start_time)
            .where('end_time', '>=', reservationData.start_time)
            .orWhere('start_time', '<=', reservationData.end_time)
            .where('end_time', '>=', reservationData.end_time);
      });      
      if (existingReservations.length > 0) {
        return new ApiError(400, 'Sân đã được đặt trong khoảng thời gian này');
      }

      const reservation = await reservationRepository()
        .where('reservation_id', reservation_id)
        .update(payload);
      return {
        ...updatedReservation,
        ...payload,
      }


    } catch (error) {
        console.log(error);
        throw new ApiError(500, 'An error occurred while updating the reservation');
    }
}

module.exports ={
    readReservations,
    createReservations,
    getByuserId,
    getAllReservations,
    updateReservation
}