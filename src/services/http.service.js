const axios = require('axios');
const BASE_URL = process.env.NODE_ENV === 'production' ? '/api/' : '//localhost:3030/api/';
console.log('BASE_URL:', BASE_URL);
export const httpService = {
  get(endpoint, query) {
    const queryStr = Object.keys(query)
      .map((key) => key + '=' + query[key])
      .join('&');
    return axios.get(`http://localhost:3030/api/${endpoint}?${queryStr}`).then((response) => response.data);
  },
  post(endpoint, data) {
    console.log('data:', data);
    console.log('BASE_URL + endpoint:', BASE_URL + endpoint);
    return axios.post(BASE_URL + endpoint, data).then((res) => res.data);
  },
  put(endpoint, data) {
    return axios(endpoint, 'PUT', data);
  },
  delete(endpoint, id) {
    return axios.delete(BASE_URL + endpoint + id);
    // return axios.delete(`http://localhost:3030/api/${endpoint}${id}`);
  },
};
