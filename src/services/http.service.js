import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_HOST;

// A page usually fires several reads at once, and with the API down they all
// fail together. Without this latch each one starts its own navigation and the
// browser aborts the previous, so the visitor pays for three page loads to
// reach the same place.
let isLeavingForNotFound = false;

export const httpService = {
  async get(endpoint, query = {}) {
    try {
      const queryStr = Object.keys(query)
        .map((key) => key + '=' + query[key])
        .join('&');
      const response = await axios.get(`${BASE_URL}${endpoint}?${queryStr}`);
      return response.data;
    } catch (error) {
      // Every failed read sends the visitor to the 404 page, whether the server
      // reported the resource missing or never answered at all: with the API
      // down there is no page left worth showing. The pathname check is what
      // stops the 404 page's own failing requests from redirecting forever.
      if (!isLeavingForNotFound && window.location.pathname !== '/404') {
        isLeavingForNotFound = true;
        window.location.replace('/404');
      }
      throw error;
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
