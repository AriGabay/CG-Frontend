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

// async function addCategory(category) {
//   await httpService.post(endpoint, category);
// }

// async function removeCategory(id) {
//   await httpService.delete(endpoint, id);
// }

export const ordersService = {
  getOrders,
  // addCategory,
  // removeCategory,
};
