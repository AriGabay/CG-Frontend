import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_HOST;
export const httpService = {
  async get(endpoint, query = {}) {
    try {
      const queryStr = Object.keys(query)
        .map((key) => key + '=' + query[key])
        .join('&');
      const response = await axios
        .get(`${BASE_URL}${endpoint}?${queryStr}`)
        .catch((error) => {
          throw new Error(error);
        });
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
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
  },
};
