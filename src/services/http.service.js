const axios = require('axios');
require('dotenv').config();
const BASE_URL = process.env.REACT_APP_API_HOST;
export const httpService = {
  get(endpoint, query) {
    console.log('🚀 ~ file: http.service.js ~ line 6 ~ get ~ query', query);
    console.log('🚀 ~ file: http.service.js ~ line 6 ~ get ~ endpoint', endpoint);
    const queryStr = Object.keys(query)
      .map((key) => key + '=' + query[key])
      .join('&');
    console.log('🚀 ~ file: http.service.js ~ line 7 ~ get ~ queryStr', queryStr);
    console.log('🚀 ~ file: http.service.js ~ line 15 ~ returnaxios.get ~ BASE_URL', BASE_URL);
    return axios.get(`${BASE_URL}${endpoint}?${queryStr}`).then((response) => {
      return response.data;
    });
  },
  post(endpoint, data) {
    return axios.post(BASE_URL + endpoint, data).then((res) => res.data);
  },
  valid(endpoint, data) {
    return axios.post(BASE_URL + endpoint, data).then((res) => {
      return res;
    });
  },
  put(endpoint, id, data) {
    return axios.put(`${BASE_URL}${endpoint}${id}`, data);
  },
  delete(endpoint, id) {
    return axios.delete(BASE_URL + endpoint + id);
  }
};
