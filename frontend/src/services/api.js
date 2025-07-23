// src/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getCharacters = async (page = 1, search = '') => {
  const response = await axios.get(`${API_BASE_URL}/characters`, {
    params: { page, search }
  });
  return response.data;
};
