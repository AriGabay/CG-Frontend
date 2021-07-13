import { httpService } from './http.service';
const endpoint = 'order/';
async function getOrders(query = { include: false }) {
  try {
    const res = await httpService.get(endpoint, query);
    return res;
  } catch (error) {
    console.error('error', error);
  }
}

export const ordersService = {
  getOrders,
};
