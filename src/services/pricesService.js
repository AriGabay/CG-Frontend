import { httpService } from './http.service';
const endpoint = 'price/';
async function getPrices(include) {
  try {
    const res = await httpService.get(endpoint, include);
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
async function addPrice(data) {
  try {
    const res = await httpService.post(endpoint, data);
    return res;
  } catch (error) {
    console.error('error', error);
  }
}
async function removePrice(id) {
  try {
    const res = await httpService.delete(endpoint, id);
    return res;
  } catch (error) {
    console.error('error', error);
  }
}

export const pricesService = {
  getPrices,
  addPrice,
  removePrice,
};
