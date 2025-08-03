import axios from "axios";

const BASE_URL = "http://localhost:8080/pgproperty"; // Adjust if your port differs

// Get all PGs
export const getAllPg = () => {
  return axios.get(`${BASE_URL}/pg`);
};

// Get PG by ID
export const getPgById = (pgId) => {
  return axios.get(`${BASE_URL}/${pgId}`);
};

// Get all rooms by PG ID
export const getRoomsByPgId = (pgId) => {
  return axios.get(`${BASE_URL}/rooms/${pgId}`);
};

// Get all reviews by PG ID
export const getReviewsByPgId = (pgId) => {
  return axios.get(`${BASE_URL}/reviews/${pgId}`);
};
