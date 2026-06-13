// src/services/modules/booking.api.js
import axiosClient from "../axiosClient";

const bookingApi = {
  // GET /bookings/user/:userId
  getByUser: (userId) => {
    return axiosClient.get(`/bookings/user/${userId}`);
  },

  // GET /bookings/:id
  getOne: (id) => {
    return axiosClient.get(`/bookings/${id}`);
  },

  // GET /bookings/showtimes/:showtimeId/seats
  getSeatsByShowtime: (showtimeId) => {
    return axiosClient.get(`/bookings/showtimes/${showtimeId}/seats`);
  },

  // POST /bookings/confirm
  confirm: (data) => {
    return axiosClient.post("/bookings/confirm", data);
  },

  // DELETE /bookings/:id/cancel
  cancel: (id, userId) => {
    return axiosClient.delete(`/bookings/${id}/cancel`, { data: { userId } });
  },
};

export default bookingApi;