import axios from "axios";

const BASE_URL = "http://localhost:8080/admin";

// Set auth token header helper
const authHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Get all users
export const getAllUsers = async (token) => {
  const res = await axios.get(`${BASE_URL}/users`, authHeaders(token));
  return res.data;
};

// Get user by ID
export const getUserById = async (id, token) => {
  const res = await axios.get(`${BASE_URL}/users/${id}`, authHeaders(token));
  return res.data;
};

// Register a new owner
export const registerOwner = async (ownerData, token) => {
  const res = await axios.post(
    `${BASE_URL}/owner/register`,
    ownerData,
    authHeaders(token)
  );
  return res.data;
};

// Get all owners
export const getAllOwners = async (token) => {
  const res = await axios.get(`${BASE_URL}/owners`, authHeaders(token));
  return res.data;
};

// Get owner by ID
export const getOwnerById = async (id, token) => {
  const res = await axios.get(`${BASE_URL}/owner/${id}`, authHeaders(token));
  return res.data;
};

// Delete owner by ID
export const deleteOwnerById = async (id, token) => {
  const res = await axios.delete(
    `${BASE_URL}/owner/${id}`,
    authHeaders(token)
  );
  return res.data;
};

//----------REVIEWS-----------

// Get reviews by PG ID
export const getReviewsByPgId = async (pgId, token) => {
  const res = await axios.get(
    `${BASE_URL}/pgproperty/${pgId}/reviews`,
    authHeaders(token)
  );
  return res.data;
};

// Get all PG properties
export const getAllPgProperties = async (token) => {
  const res = await axios.get(`${BASE_URL}/pgproperty`, authHeaders(token));
  return res.data;
};


// ----------BOOKINGS-----------

// Get all bookings for a specific PG by PG ID
export const getBookingsByPgId = async (pgId, token) => {
  const res = await axios.get(
    `${BASE_URL}/bookings/pgproperty/${pgId}`,
    authHeaders(token)
  );
  return res.data;
};

// Get a specific booking by Booking ID
export const getBookingById = async (bookingId, token) => {
  const res = await axios.get(
    `${BASE_URL}/bookings/${bookingId}`,
    authHeaders(token)
  );
  return res.data;
};