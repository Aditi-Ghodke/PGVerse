import axios from "axios";

const BASE_URL = "http://localhost:8080/users";

// Add token to headers
const authHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// --------- USER ---------

// USER REGISTRATION
export const registerUser = (data) => {
  return axios.post(`${BASE_URL}/register`, data);
};

// CHANGE PASSWORD
export const changePassword = (data, token) => {
  return axios.put(`${BASE_URL}/changePassword`, data, authHeaders(token));
};

// GET USER BY ID
export const getUserById = (userId, token) => {
  return axios.get(`${BASE_URL}/${userId}`, authHeaders(token));
};

// UPDATE USER
export const updateUser = (userId, data, token) => {
  return axios.put(`${BASE_URL}/${userId}`, data, authHeaders(token));
};

// DELETE USER
export const deleteUser = (userId, token) => {
  return axios.delete(`${BASE_URL}/${userId}`, authHeaders(token));
};

// --------- REVIEWS ---------

// ADD REVIEW
export const addReview = (pgId, userId, data, token) => {
  return axios.post(`${BASE_URL}/reviews/${pgId}/${userId}`, data, authHeaders(token));
};

// UPDATE REVIEW
export const updateReview = (reviewId, data, token) => {
  return axios.put(`${BASE_URL}/reviews/${reviewId}`, data, authHeaders(token));
};

// GET REVIEW BY USER
export const getReviewsByUser = (userId, token) => {
  return axios.get(`${BASE_URL}/${userId}/reviews`, authHeaders(token));
};

// DELETE REVIEW
export const deleteReview = (reviewId, token) => {
  return axios.delete(`${BASE_URL}/reviews/${reviewId}`, authHeaders(token));
};

// --------- BOOKING ---------

// MAKE BOOKING
export const makeBooking = (data, token) => {
  return axios.post(`${BASE_URL}/bookings`, data, authHeaders(token));
};

// MAKE PAYMENT
export const makePayment = (bookingId, data, token) => {
  return axios.post(`${BASE_URL}/${bookingId}/payment`, data, authHeaders(token));
};

// GET BOOKINGS BY USER ID
export const getBookingsByUser = (userId, token) => {
  return axios.get(`${BASE_URL}/bookings/users/${userId}`, authHeaders(token));
};

// GET BOOKING BY BOOKING ID
export const getBookingById = (bookingId, token) => {
  return axios.get(`${BASE_URL}/bookings/${bookingId}`, authHeaders(token));
};

// CANCEL BOOKING
export const cancelBooking = (userId, bookingId, token) => {
  return axios.put(`${BASE_URL}/bookings/cancel/${userId}/${bookingId}`, {}, authHeaders(token));
};

// --------- SERVICES ---------

// REQUEST SERVICE
export const requestService = (data, token) => {
  return axios.post(`${BASE_URL}/services/request-service`, data, authHeaders(token));
};