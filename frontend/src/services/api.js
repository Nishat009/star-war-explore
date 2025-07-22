// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api';

// export const getCharacters = async (page = 1) => {
//   const response = await axios.get(`${API_BASE_URL}/characters?page=${page}`);
//   return response.data;
// };

// export const searchCharacters = async (name) => {
//   const response = await axios.get(`${API_BASE_URL}/characters/search?name=${name}`);
//   console.log('Search Response:', response.data); // Debug log
//   return response.data;
// };

// export const getCharacterDetails = async (id, { signal } = {}) => {
//   const response = await axios.get(`${API_BASE_URL}/characters/${id}`, { signal });
//   console.log('Full Response:', response.data); // Log the entire response
//   return response.data;
// };


import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getCharacters = async (page = 1) => {
  const response = await axios.get(`${API_BASE_URL}/characters?page=${page}`);
  return response.data;
};

export const searchCharacters = async (name) => {
  const response = await axios.get(`${API_BASE_URL}/characters/search?name=${name}`);
  return response.data;
};

export const getCharacterDetails = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/characters/${id}`);
  return response.data;
};