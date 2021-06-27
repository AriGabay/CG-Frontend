const axios = require('axios');
// const BASE_URL = 'http://localhost:3030/api/';
const BASE_URL = process.env.REACT_APP_API_HOST;
console.log('BASE_URL:', process.env);
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
  put(endpoint, data) {
    return axios.put(endpoint, data);
  },
  delete(endpoint, id) {
    return axios.delete(BASE_URL + endpoint + id);
    // return axios.delete(`http://localhost:3030/api/${endpoint}${id}`);
  },
};
