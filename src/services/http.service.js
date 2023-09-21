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
      if (!window.location.href.includes(404)) {
        console.log(window.location.replace(window.location.href + '404'));
      }
      throw new Error(error);
    }
  },
  post(endpoint, data) {
    return axios
      .post(BASE_URL + endpoint, data)
      .then((res) => res.data)
      .catch((error) => {
        console.log('error', error);
        throw error;
      });
  },
  valid(endpoint, data) {
    return axios
      .post(BASE_URL + endpoint, data)
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.log('error', error);
        throw error;
      });
  },
  put(endpoint, id, data) {
    return axios.put(`${BASE_URL}${endpoint}${id}`, data).catch((error) => {
      console.log('error', error);
      throw error;
    });
  },
  delete(endpoint, id) {
    return axios.delete(BASE_URL + endpoint + id).catch((error) => {
      console.log('error', error);
      throw error;
    });
  },
};
