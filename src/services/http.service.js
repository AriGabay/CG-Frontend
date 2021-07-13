const axios = require('axios');
require('dotenv').config();
const BASE_URL = process.env.REACT_APP_API_HOST;
export const httpService = {
  get(endpoint, query) {
    const queryStr = Object.keys(query)
      .map((key) => key + '=' + query[key])
      .join('&');
    return axios.get(`${BASE_URL}${endpoint}?${queryStr}`).then((response) => response.data);
  },
  post(endpoint, data) {
    return axios.post(BASE_URL + endpoint, data).then((res) => res.data);
  },
  put(endpoint, id, data) {
    return axios.put(`${BASE_URL}${endpoint}${id}`, data);
  },
  delete(endpoint, id) {
    return axios.delete(BASE_URL + endpoint + id);
  },
};
