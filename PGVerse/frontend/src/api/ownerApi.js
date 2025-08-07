import axios from "axios";

const BASE_URL = "http://localhost:8080/owner";

const authHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// --------- OWNER APIs ---------

export const getOwnerById = (id, token) =>
  axios.get(`${BASE_URL}/${id}`, authHeaders(token));

export const changeOwnerPassword = (dto, token) =>
  axios.post(`${BASE_URL}/change-password`, dto, authHeaders(token));

export const updateOwner = (ownerId, dto, token) =>
  axios.put(`${BASE_URL}/${ownerId}`, dto, authHeaders(token));

// --------- PG PROPERTY ---------

export const addPgProperty = (ownerId, dto, imageFile, token) => {
  const formData = new FormData();
  Object.keys(dto).forEach((key) => formData.append(key, dto[key]));
  formData.append("imageFile", imageFile);

  return axios.post(`${BASE_URL}/pgproperty/${ownerId}`, formData, {
    ...authHeaders(token),
    headers: {
      ...authHeaders(token).headers,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updatePgProperty = (pgId, dto, imageFile, token) => {
  const formData = new FormData();
  Object.keys(dto).forEach((key) => formData.append(key, dto[key]));
  formData.append("imageFile", imageFile);

  return axios.put(`${BASE_URL}/pgproperty/${pgId}`, formData, {
    ...authHeaders(token),
    headers: {
      ...authHeaders(token).headers,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deletePgProperty = (pgId, token) =>
  axios.delete(`${BASE_URL}/pgproperty/${pgId}`, authHeaders(token));

export const getPropertyById = (pgId, token) =>
  axios.get(`${BASE_URL}/pgproperty/${pgId}`, authHeaders(token));

export const getPgByOwnerId = (ownerId, token) =>
  axios.get(`${BASE_URL}/pgproperty/${ownerId}/owner`, authHeaders(token));

// --------- ROOMS ---------

export const addRoomToPg = (pgId, dto, imageFile, token) => {
  const formData = new FormData();
  Object.keys(dto).forEach((key) => formData.append(key, dto[key]));
  formData.append("imageFile", imageFile);

  return axios.post(`${BASE_URL}/pgproperty/${pgId}/rooms`, formData, {
    ...authHeaders(token),
    headers: {
      ...authHeaders(token).headers,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateRoom = (roomId, dto, imageFile, token) => {
  const formData = new FormData();
  Object.keys(dto).forEach((key) => formData.append(key, dto[key]));
  if (imageFile) formData.append("imageFile", imageFile);

  return axios.put(`${BASE_URL}/rooms/${roomId}`, formData, {
    ...authHeaders(token),
    headers: {
      ...authHeaders(token).headers,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteRoom = (roomId, token) =>
  axios.delete(`${BASE_URL}/rooms/${roomId}`, authHeaders(token));

export const getAllRooms = (pgId, token) =>
  axios.get(`${BASE_URL}/pgproperty/${pgId}/rooms`, authHeaders(token));

export const getRoomById = (roomId, token) =>
  axios.get(`${BASE_URL}/rooms/${roomId}`, authHeaders(token));

// --------- SERVICES ---------

export const addService = (ownerId, dto, token) =>
  axios.post(`${BASE_URL}/services/${ownerId}/add-service`, dto, authHeaders(token));

export const getRequestedServicesByPgId = (pgId, token) =>
  axios.get(`${BASE_URL}/users/services/${pgId}`, authHeaders(token));

export const getServicesByPgId = (pgId, token) =>
  axios.get(`${BASE_URL}/services/${pgId}`, authHeaders(token));

// --------- REVIEWS ---------

export const getReviewByPgId = (pgId, token) =>
  axios.get(`${BASE_URL}/pgproperty/${pgId}/reviews`, authHeaders(token));

// --------- BOOKINGS ---------

export const getBookingsByPgId = (pgId, token) =>
  axios.get(`${BASE_URL}/bookings/pgproperty/${pgId}`, authHeaders(token));

export const manuallyUpdateBookings = (token) =>
  axios.get(`${BASE_URL}/bookings/update-status`, authHeaders(token));
